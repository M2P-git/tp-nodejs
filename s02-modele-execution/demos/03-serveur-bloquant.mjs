// Séance 2 : bloquer la boucle d'événements bloque TOUS les clients.
//   Terminal 1 :  node 03-serveur-bloquant.mjs
//   Terminal 2 :  node client-mesure.mjs 3000
//   (ou à la main : curl.exe http://localhost:3000/lent puis, vite, curl.exe http://localhost:3000/rapide)
// Observation : /rapide attend la fin de /lent, alors qu'il n'a rien à calculer.
import { createServer } from 'node:http';

function calculLourd(ms) {
  // Simule un calcul CPU (hachage, tri d'un énorme tableau, génération PDF…)
  const fin = Date.now() + ms;
  let n = 0;
  while (Date.now() < fin) n++;
  return n;
}

const serveur = createServer((req, res) => {
  const debut = Date.now();
  if (req.url === '/lent') {
    calculLourd(5000); // 5 secondes de CPU : la boucle est bloquée
  }
  res.end(`${req.url} servi en ${Date.now() - debut} ms (pid ${process.pid})\n`);
});

serveur.listen(3000, () => console.log('http://localhost:3000  (routes : /rapide et /lent)'));
