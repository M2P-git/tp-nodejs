// Séance 2 : client de mesure (le temps est mesuré CÔTÉ CLIENT, attente comprise).
// Lance /lent puis, 200 ms plus tard, /rapide, et affiche le temps perçu par chacun.
//   node client-mesure.mjs 3000   (serveur bloquant : 03-serveur-bloquant.mjs)
//   node client-mesure.mjs 3001   (serveur avec worker : 07-worker-threads.mjs)
import { setTimeout as attendre } from 'node:timers/promises';

const port = process.argv[2] ?? '3000';
const mesurer = async (route) => {
  const debut = Date.now();
  await fetch(`http://localhost:${port}${route}`).then((r) => r.text());
  console.log(`${route.padEnd(8)} → réponse reçue après ${Date.now() - debut} ms`);
};

await Promise.all([mesurer('/lent'), attendre(200).then(() => mesurer('/rapide'))]);
