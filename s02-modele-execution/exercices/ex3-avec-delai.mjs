// Exercice 3 : ne jamais attendre indéfiniment
//
// avecDelai(fn, ms) exécute fn(signal), une fonction async qui reçoit un AbortSignal, et :
//   - renvoie son résultat si elle se termine en moins de « ms » millisecondes ;
//   - sinon REJETTE avec une ErreurDelai (fournie ci-dessous) ET déclenche l'annulation du
//     signal, pour que fn puisse arrêter son travail (ex. fetch(url, { signal }) s'interrompt) ;
//   - si fn échoue avant le délai, propage son erreur telle quelle ;
//   - ne laisse AUCUN minuteur actif derrière elle (sinon le processus ne s'arrête pas).
//
// Cas réel : un appel à l'API du fournisseur de SMS ne doit pas bloquer une réservation
// plus de 3 secondes.
//
// Vérification (depuis le dossier de la séance) :  node --test

export class ErreurDelai extends Error {
  constructor(ms) {
    super(`Délai de ${ms} ms dépassé`);
    this.name = 'ErreurDelai';
  }
}

export async function avecDelai(fn, ms) {
  // TODO
  throw new Error('À implémenter');
}
