// Séance 2 : dans quel ordre ces lignes s'affichent-elles ?
// Prédisez AVANT d'exécuter :  node 01-ordre-execution.mjs
// (MÊME code, mais en module ES : extension .mjs). Comparez avec la version .cjs !

console.log('1. synchrone (début)');

setTimeout(() => console.log('5. setTimeout 0  (phase timers)'), 0);
setImmediate(() => console.log('6. setImmediate (phase check)'));

Promise.resolve().then(() => console.log('4. promesse (file des microtâches)'));
queueMicrotask(() => console.log('4bis. queueMicrotask (file des microtâches)'));
process.nextTick(() => console.log('3. process.nextTick (file nextTick)'));

console.log('2. synchrone (fin)');

// Remarque : l'ordre entre 5 et 6 n'est PAS garanti dans le module principal
// (il dépend du temps écoulé avant l'entrée dans la boucle). Relancez plusieurs fois.
