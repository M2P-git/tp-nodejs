// Correction de l'exercice 7 (promesses, async/await et try/catch)

export function attendre(ms) {
  // resolve est appelé par le minuteur après « ms » millisecondes
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function doublerApres(ms, n) {
  await attendre(ms); // la fonction est suspendue ici, pas le thread
  return n * 2; // une fonction async retourne une promesse qui se règle avec cette valeur
}

export function lireJsonSecurise(texte) {
  try {
    return JSON.parse(texte);
  } catch {
    return null;
  }
}
