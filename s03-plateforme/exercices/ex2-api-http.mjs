// Exercice 2 : une mini-API avec node:http seulement (sans framework)
//
// Contrat à respecter (toutes les réponses sont en JSON, y compris les erreurs) :
//   GET  /sante                       → 200 { statut: 'ok' }
//   GET  /creneaux?date=AAAA-MM-JJ    → 200 { date, creneaux: ['09:00', …] }   | 400 si date invalide
//   POST /reservations  { date, heure, client }
//                                     → 201 { id, date, heure, client } + en-tête Location: /reservations/:id
//                                       400 JSON mal formé ou champ invalide
//                                       409 créneau déjà pris
//                                       413 corps > 10 Kio
//                                       415 Content-Type différent de application/json
//   GET  /reservations/:id            → 200 { … } | 404
//   toute autre route                 → 404 { erreur: '…' }
//
// Les règles métier sont déjà écrites dans domaine.mjs : ne vous occupez QUE de HTTP.
// Vérification (depuis le dossier de la séance) :  node --test
import { createServer } from 'node:http';
import { creerStock, estDateCalendaire, validerReservation, ErreurHttp } from './domaine.mjs';

const LIMITE_CORPS = 10 * 1024; // 10 Kio

function envoyerJson(res, status, donnees, entetes = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...entetes });
  res.end(JSON.stringify(donnees));
}

// TODO 1 : lire le corps de la requête et le parser en JSON.
// req est un STREAM : le corps arrive en plusieurs morceaux (événements 'data'), puis 'end'.
//   - rejeter avec new ErreurHttp(413, '…') dès que le corps dépasse « limite » octets ;
//   - rejeter avec new ErreurHttp(400, '…') si le JSON est invalide ;
//   - sinon, résoudre avec l'objet parsé.
export function lireCorpsJson(req, limite = LIMITE_CORPS) {
  return Promise.reject(new Error('À implémenter'));
}

export function creerServeur() {
  const stock = creerStock(); // chaque serveur a son propre stock en mémoire

  return createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    try {
      if (req.method === 'GET' && url.pathname === '/sante') {
        return envoyerJson(res, 200, { statut: 'ok' });
      }

      // TODO 2 : GET /creneaux?date=AAAA-MM-JJ   (url.searchParams.get('date'))

      // TODO 3 : POST /reservations
      //   vérifier le Content-Type (req.headers['content-type']), lire le corps,
      //   valider avec validerReservation(), réserver avec stock.reserver()

      // TODO 4 : GET /reservations/:id   (une expression régulière sur url.pathname)

      envoyerJson(res, 404, { erreur: `Route inconnue : ${req.method} ${url.pathname}` });
    } catch (err) {
      // TODO 5 : une ErreurHttp doit produire une réponse avec SON statut et son message.
      //          Toute autre erreur est un bug : la journaliser et répondre 500.
      envoyerJson(res, 500, { erreur: 'Erreur interne' });
    }
  });
}

// Lancement manuel :  node exercices/ex2-api-http.mjs
if (import.meta.main) {
  creerServeur().listen(3000, () => console.log('http://localhost:3000'));
}
