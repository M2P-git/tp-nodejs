// Séance 1 (idée n°8) : erreurs synchrones, callbacks « error-first » et promesses.
//   node 09-erreurs.mjs
import { readFile } from 'node:fs';
import { readFile as readFileP } from 'node:fs/promises';

// 1) Style historique de Node : le callback reçoit (erreur, résultat)
readFile('fichier-absent.txt', 'utf8', (err, contenu) => {
  if (err) return console.log('callback  →', err.code); // ENOENT
  console.log(contenu);
});

// 2) Style moderne : promesse + async/await + try/catch
try {
  await readFileP('fichier-absent.txt', 'utf8');
} catch (err) {
  console.log('await     →', err.code);
}

// 3) Toujours lever des objets Error (pile d'appels !), jamais des chaînes
class ErreurMetier extends Error {
  constructor(message, statusHttp) {
    super(message);
    this.name = 'ErreurMetier';
    this.statusHttp = statusHttp;
  }
}
try {
  throw new ErreurMetier('Créneau déjà réservé', 409);
} catch (e) {
  console.log('métier    →', e.name, e.statusHttp, e.message, e instanceof Error);
}
