// Séance 1 (idée n°10) : un module = une portée privée + une instance unique (cache).
//   node 06-module-singleton/main.mjs
// Combien de fois « chargement » s'affiche-t-il ? Quelles valeurs sont affichées ?
import { depuisA } from './a.mjs';
import { incrementer } from './compteur.mjs';

console.log(depuisA(), incrementer(), depuisA());
