// Séance 2 : dans un callback d'E/S, l'ordre devient DÉTERMINISTE.
// Après la phase « poll » (où s'exécute le callback de readFile), la boucle passe
// par la phase « check » (setImmediate) AVANT de revenir à la phase « timers ».
import { readFile } from 'node:fs';

readFile(import.meta.filename, () => {
  setTimeout(() => console.log('2. setTimeout 0'), 0);
  setImmediate(() => console.log('1. setImmediate'));
});
