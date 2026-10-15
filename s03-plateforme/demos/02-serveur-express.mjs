// Séance 3 : le même serveur avec Express 5.
//   npm install            (une seule fois, dans le dossier de la séance)
//   npm run demo:express
//
// Express n'ajoute pas de « magie » : c'est une chaîne de fonctions (middlewares) appelées
// dans l'ordre pour chaque requête. express.json() est un middleware qui lit le stream du
// corps et remplit req.body : exactement ce que la démo 01 faisait à la main.
import express from 'express';

const app = express();
app.use(express.json({ limit: '10kb' }));

// Un middleware « maison » : une simple fonction (req, res, next)
app.use((req, res, next) => {
  const debut = performance.now();
  res.on('finish', () => console.log(req.method, req.originalUrl, res.statusCode, `${Math.round(performance.now() - debut)} ms`));
  next();
});

app.get('/sante', (req, res) => res.json({ statut: 'ok', uptime: process.uptime() }));
app.post('/echo', (req, res) => res.json({ recu: req.body }));

// Express 5 : une erreur levée (ou une promesse rejetée) dans une route async
// est transmise automatiquement au gestionnaire d'erreurs ci-dessous.
app.get('/erreur', async () => {
  throw new Error('panne simulée');
});

app.use((req, res) => res.status(404).json({ erreur: `Route inconnue : ${req.method} ${req.path}` }));

// Gestionnaire d'erreurs : reconnu par Express grâce à ses QUATRE paramètres
app.use((err, req, res, next) => {
  const status = err.status ?? 500; // body-parser fournit 400 (JSON invalide) ou 413 (trop gros)
  res.status(status).json({ erreur: status === 500 ? 'Erreur interne' : err.message });
});

app.listen(3000, () => console.log('http://localhost:3000  (Ctrl+C pour arrêter)'));
