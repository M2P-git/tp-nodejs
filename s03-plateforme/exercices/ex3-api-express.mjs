// Exercice 3 : la même API avec Express 5
//
// Prérequis : npm install   (dans le dossier de la séance, une seule fois)
//
// Réimplémentez EXACTEMENT le contrat de l'exercice 2 avec Express. La même suite de tests
// (contrat-api.mjs) doit passer. Puis comparez les deux fichiers :
//   - combien de lignes avez-vous économisées ?
//   - qu'est-ce qu'Express fait à votre place ? (corps, JSON, limite de taille, routage, erreurs)
//   - qu'est-ce qui n'a PAS changé ? (indice : domaine.mjs)
//
// Aide-mémoire Express 5 :
//   app.use(express.json({ limit: '10kb' }))   → remplit req.body ; erreurs 400 / 413 automatiques
//   req.query.date, req.params.id, req.is('application/json')
//   res.status(201).location('/…').json(objet)
//   Une erreur levée dans une route (même async) part vers le gestionnaire d'erreurs :
//   app.use((err, req, res, next) => { … })   ← QUATRE paramètres, déclaré en DERNIER
//
// Vérification (depuis le dossier de la séance) :  node --test
import { createServer } from 'node:http';
import express from 'express';
import { creerStock, estDateCalendaire, validerReservation, ErreurHttp } from './domaine.mjs';

export function creerServeur() {
  const stock = creerStock();
  const app = express();

  // TODO

  return createServer(app);
}

// Lancement manuel :  node exercices/ex3-api-express.mjs
if (import.meta.main) {
  creerServeur().listen(3000, () => console.log('http://localhost:3000'));
}
