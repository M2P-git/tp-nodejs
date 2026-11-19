// Exercice 2 : une mini-API avec node:http seulement (CORRECTION)
//
// À retenir :
//  - Le corps d'une requête est un STREAM. On compte les octets au fil de l'eau : on ne
//    laisse jamais un client nous faire charger 2 Go en mémoire (attaque par épuisement, API4).
//  - Après un 413, on continue de « drainer » le flux (l'écouteur 'data' reste en place)
//    pour que la connexion reste dans un état propre.
//  - Toutes les erreurs « prévues » sont des ErreurHttp ; tout le reste est un bug → 500,
//    sans divulguer le détail au client (il est journalisé côté serveur).
//  - Le check « créneau libre ? » puis l'insertion sont SYNCHRONES dans stock.reserver() :
//    aucune autre requête ne peut s'intercaler, d'où le test de concurrence qui passe.
//    Avec une base de données (S6), ce ne sera plus vrai…
import { createServer } from 'node:http';
import { creerStock, estDateCalendaire, validerReservation, ErreurHttp } from './domaine.mjs';

const LIMITE_CORPS = 10 * 1024; // 10 Kio

function envoyerJson(res, status, donnees, entetes = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...entetes });
  res.end(JSON.stringify(donnees));
}

export function lireCorpsJson(req, limite = LIMITE_CORPS) {
  return new Promise((resoudre, rejeter) => {
    const morceaux = [];
    let taille = 0;
    let tropGros = false;

    req.on('data', (morceau) => {
      if (tropGros) return; // on draine sans stocker
      taille += morceau.length;
      if (taille > limite) {
        tropGros = true;
        morceaux.length = 0;
        rejeter(new ErreurHttp(413, `Corps trop volumineux (maximum ${limite} octets)`));
        return;
      }
      morceaux.push(morceau);
    });

    req.on('end', () => {
      if (tropGros) return;
      try {
        resoudre(JSON.parse(Buffer.concat(morceaux).toString('utf8')));
      } catch {
        rejeter(new ErreurHttp(400, 'JSON mal formé'));
      }
    });

    req.on('error', rejeter);
  });
}

export function creerServeur() {
  const stock = creerStock();

  return createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    try {
      if (req.method === 'GET' && url.pathname === '/sante') {
        return envoyerJson(res, 200, { statut: 'ok' });
      }

      if (req.method === 'GET' && url.pathname === '/creneaux') {
        const date = url.searchParams.get('date');
        if (!estDateCalendaire(date)) {
          throw new ErreurHttp(400, 'Paramètre « date » invalide (format AAAA-MM-JJ attendu)');
        }
        return envoyerJson(res, 200, { date, creneaux: stock.creneauxLibres(date) });
      }

      if (req.method === 'POST' && url.pathname === '/reservations') {
        if (!(req.headers['content-type'] ?? '').startsWith('application/json')) {
          req.resume(); // on ignore le corps, mais on le consomme
          throw new ErreurHttp(415, 'Content-Type « application/json » attendu');
        }
        const corps = await lireCorpsJson(req);
        const champs = validerReservation(corps);
        if (champs.length > 0) {
          throw new ErreurHttp(400, `Champs invalides : ${champs.join(', ')}`, champs);
        }
        const reservation = stock.reserver(corps);
        return envoyerJson(res, 201, reservation, { Location: `/reservations/${reservation.id}` });
      }

      const correspondance = url.pathname.match(/^\/reservations\/(\d+)$/);
      if (req.method === 'GET' && correspondance) {
        const reservation = stock.trouver(Number(correspondance[1]));
        if (!reservation) throw new ErreurHttp(404, 'Réservation introuvable');
        return envoyerJson(res, 200, reservation);
      }

      envoyerJson(res, 404, { erreur: `Route inconnue : ${req.method} ${url.pathname}` });
    } catch (err) {
      if (err instanceof ErreurHttp) {
        return envoyerJson(res, err.status, { erreur: err.message, ...(err.champs && { champs: err.champs }) });
      }
      console.error(err); // un vrai bug : on le journalise côté serveur…
      envoyerJson(res, 500, { erreur: 'Erreur interne' }); // …sans le détailler au client
    }
  });
}

if (import.meta.main) {
  creerServeur().listen(3000, () => console.log('http://localhost:3000'));
}
