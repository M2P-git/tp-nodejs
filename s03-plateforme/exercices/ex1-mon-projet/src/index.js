import express from 'express';

const port = Number(process.env.PORT ?? 3000);
const app = express();

app.get('/sante', (req, res) => {
  res.json({ statut: 'ok', environnement: process.env.NODE_ENV ?? 'development' });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
