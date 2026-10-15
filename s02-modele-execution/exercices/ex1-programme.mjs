// Exercice 1 : programme à analyser (NE PAS MODIFIER CE FICHIER).
// Prédisez l'ordre d'affichage des lettres et écrivez-le dans ex1-prediction.mjs.
// N'exécutez ce fichier qu'APRÈS avoir fait votre prédiction et justifié chaque position.
import { readFile } from 'node:fs';

console.log('A');

setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
process.nextTick(() => console.log('D'));

readFile(import.meta.filename, () => {
  console.log('E');
  setTimeout(() => console.log('F'), 0);
  setImmediate(() => console.log('G'));
  process.nextTick(() => console.log('H'));
  Promise.resolve().then(() => console.log('I'));
});

(async () => {
  console.log('J');
  await null;
  console.log('K');
})();

console.log('L');
