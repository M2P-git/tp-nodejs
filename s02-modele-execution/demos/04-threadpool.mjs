// Séance 2 : le pool de threads de libuv (4 threads par défaut).
// pbkdf2 (hachage volontairement coûteux) est exécuté HORS de la boucle,
// dans le pool. Avec 8 tâches et 4 threads, on observe 2 « vagues ».
//
//   node 04-threadpool.mjs
//   PowerShell :  $env:UV_THREADPOOL_SIZE=8; node 04-threadpool.mjs
//   bash       :  UV_THREADPOOL_SIZE=8 node 04-threadpool.mjs
import { pbkdf2 } from 'node:crypto';

const debut = Date.now();
const taille = process.env.UV_THREADPOOL_SIZE ?? '4 (défaut)';
console.log(`UV_THREADPOOL_SIZE = ${taille}`);

for (let i = 1; i <= 8; i++) {
  pbkdf2('motdepasse', 'sel', 300_000, 64, 'sha512', () => {
    console.log(`tâche ${i} terminée à ${Date.now() - debut} ms`);
  });
}
console.log('Les 8 tâches sont lancées : la boucle est libre pendant ce temps.');
