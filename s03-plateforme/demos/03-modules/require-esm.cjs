// Depuis Node 22.12 / 20.19, un fichier CommonJS peut faire require() d'un module ES…
// … à condition que ce module n'utilise PAS de top-level await.
//   node demos/03-modules/require-esm.cjs
const { tarifHT } = require('./sans-await.mjs');
console.log('require(esm) fonctionne :', tarifHT(1200));

try {
  require('./moderne.mjs'); // contient un top-level await
} catch (e) {
  console.log('Échec attendu :', e.code); // ERR_REQUIRE_ASYNC_MODULE
}
