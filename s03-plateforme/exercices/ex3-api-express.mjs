// Exercice 3 : la même API avec Express 5 (CORRECTION)
//
// Ce qu'Express (et son middleware express.json) fait à notre place :
//   - lire le stream du corps, appliquer la limite de taille (413), parser le JSON (400) ;
//   - router par méthode + chemin, extraire :id dans req.params ;
//   - transmettre au gestionnaire d'erreurs toute exception, même dans une route async.
// Ce qui n'a PAS changé : domaine.mjs. Les règles métier ne dépendent pas du framework.
// C'est ce qui permettra de les tester sans serveur HTTP (séance 6).
import { createServer } from 'node:http';
import express from 'express';
import { creerStock, estDateCalendaire, validerReservation, ErreurHttp } from './domaine.mjs';

export function creerServeur() {
  const stock = creerStock();
  const app = express();

  app.use(express.json({ limit: '10kb' }));

  app.get('/sante', (req, res) => {
    res.json({ statut: 'ok' });
  });

  app.get('/creneaux', (req, res) => {
    const { date } = req.query;
    if (!estDateCalendaire(date)) {
      throw new ErreurHttp(400, 'Paramètre « date » invalide (format AAAA-MM-JJ attendu)');
    }
    res.json({ date, creneaux: stock.creneauxLibres(date) });
  });

  app.post('/reservations', (req, res) => {
    if (!req.is('application/json')) {
      throw new ErreurHttp(415, 'Content-Type « application/json » attendu');
    }
    const champs = validerReservation(req.body);
    if (champs.length > 0) {
      throw new ErreurHttp(400, `Champs invalides : ${champs.join(', ')}`, champs);
    }
    const reservation = stock.reserver(req.body);
    res.status(201).location(`/reservations/${reservation.id}`).json(reservation);
  });

  app.get('/reservations/:id', (req, res) => {
    const reservation = stock.trouver(Number(req.params.id));
    if (!reservation) throw new ErreurHttp(404, 'Réservation introuvable');
    res.json(reservation);
  });

  // Aucune route n'a répondu : 404
  app.use((req, res) => {
    res.status(404).json({ erreur: `Route inconnue : ${req.method} ${req.path}` });
  });

  // Gestionnaire d'erreurs (4 paramètres, déclaré en dernier)
  app.use((err, req, res, next) => {
    if (err instanceof ErreurHttp) {
      return res.status(err.status).json({ erreur: err.message, ...(err.champs && { champs: err.champs }) });
    }
    if (err.type === 'entity.parse.failed') return res.status(400).json({ erreur: 'JSON mal formé' });
    if (err.type === 'entity.too.large') return res.status(413).json({ erreur: 'Corps trop volumineux' });
    console.error(err);
    res.status(500).json({ erreur: 'Erreur interne' });
  });

  return createServer(app);
}

if (import.meta.main) {
  creerServeur().listen(3000, () => console.log('http://localhost:3000'));
}
