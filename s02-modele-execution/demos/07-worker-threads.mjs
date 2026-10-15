// Séance 2 : sortir un calcul CPU de la boucle avec worker_threads.
// Même serveur que 03-serveur-bloquant.mjs, mais /lent délègue le calcul à un worker :
// /rapide répond instantanément, même pendant un /lent.
//   node 07-worker-threads.mjs
//   node client-mesure.mjs 3001
import { createServer } from 'node:http';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';

if (isMainThread) {
  const lancerWorker = (ms) =>
    new Promise((resolve, reject) => {
      // Le même fichier sert de script au worker (branche « else » ci-dessous)
      const w = new Worker(new URL(import.meta.url), { workerData: ms });
      w.once('message', resolve);
      w.once('error', reject);
    });

  createServer(async (req, res) => {
    const debut = Date.now();
    if (req.url === '/lent') await lancerWorker(5000);
    res.end(`${req.url} servi en ${Date.now() - debut} ms\n`);
  }).listen(3001, () => console.log('http://localhost:3001  (routes : /rapide et /lent)'));
} else {
  // Code exécuté dans un AUTRE thread, avec sa propre boucle et son propre tas V8
  const fin = Date.now() + workerData;
  let n = 0;
  while (Date.now() < fin) n++;
  parentPort.postMessage(n);
}
