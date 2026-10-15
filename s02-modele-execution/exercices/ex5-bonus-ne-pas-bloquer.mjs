// Exercice 5 (bonus) : découper un calcul pour ne pas bloquer la boucle
//
// compterPremiers(n) compte les nombres premiers inférieurs à n. Avec n = 3 000 000,
// le calcul bloque la boucle d'événements pendant plusieurs centaines de millisecondes :
// pendant ce temps, le serveur ne répond plus à personne (voir demos/03-serveur-bloquant.mjs).
//
// Écrivez compterPremiersSansBloquer(n) qui renvoie une Promise du même résultat, mais qui
// rend la main à la boucle d'événements régulièrement (par exemple tous les 50 000 nombres),
// pour que les autres callbacks (minuteurs, requêtes HTTP) puissent s'exécuter entre-temps.
//
// Indice : setImmediate(), ou « await new Promise((r) => setImmediate(r)) ».
// Question : pourquoi « await Promise.resolve() » ne suffirait-il PAS ?
//
// Vérification (depuis le dossier de la séance) :  node --test

export function estPremier(k) {
  if (k < 2) return false;
  for (let d = 2; d * d <= k; d++) if (k % d === 0) return false;
  return true;
}

export function compterPremiers(n) {
  let total = 0;
  for (let k = 2; k < n; k++) if (estPremier(k)) total++;
  return total;
}

export async function compterPremiersSansBloquer(n) {
  // TODO
  throw new Error('À implémenter');
}
