// Exercice 3 : ne jamais attendre indéfiniment (CORRECTION)
//
// Promise.race met en concurrence deux promesses : le travail et un minuteur qui rejette.
// La première à se terminer l'emporte.
// Deux détails qui font la différence en production :
//   1. abort() : sans lui, le travail perdant continue (requête HTTP ouverte, socket occupé…).
//   2. clearTimeout dans finally : sans lui, un minuteur de 3 s reste programmé après chaque
//      appel réussi ; avec des milliers d'appels, on accumule des minuteurs inutiles, et le
//      processus ne peut pas s'arrêter proprement tant qu'ils sont actifs.
//
// Alternative moderne : AbortSignal.timeout(ms) crée directement un signal qui s'annule
// tout seul (voir demos/09-timeout-abort.mjs). Il faut alors écouter son événement 'abort'
// pour rejeter avec notre propre ErreurDelai.

export class ErreurDelai extends Error {
  constructor(ms) {
    super(`Délai de ${ms} ms dépassé`);
    this.name = 'ErreurDelai';
  }
}

export async function avecDelai(fn, ms) {
  const controleur = new AbortController();
  let minuteur;

  const delaiDepasse = new Promise((_, rejeter) => {
    minuteur = setTimeout(() => {
      controleur.abort();
      rejeter(new ErreurDelai(ms));
    }, ms);
  });

  try {
    return await Promise.race([fn(controleur.signal), delaiDepasse]);
  } finally {
    clearTimeout(minuteur);
  }
}
