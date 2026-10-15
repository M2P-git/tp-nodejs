// Exercice 4 : limiter la concurrence (CORRECTION)
//
// Idée : lancer « limite » ouvriers. Chaque ouvrier prend la prochaine tâche disponible,
// l'attend, puis recommence, jusqu'à épuisement de la liste.
//
// Pourquoi « const i = prochain++ » est-il sûr alors que plusieurs ouvriers le lisent ?
// Parce que JavaScript est mono-thread : entre deux « await », le code s'exécute sans
// interruption. Aucun autre ouvrier ne peut s'intercaler entre la lecture et l'incrément.
// (Ce raisonnement ne vaut PLUS dès qu'il y a plusieurs processus ou une base de données
//  partagée : c'est le problème de la double réservation, en séance 6.)
//
// Promise.all(taches.map((t) => t())) lancerait les 2 000 envois en même temps :
// le fournisseur renverrait des erreurs 429 (trop de requêtes), voire bloquerait le compte.

export async function executerAvecLimite(taches, limite) {
  const resultats = new Array(taches.length);
  let prochain = 0;

  async function ouvrier() {
    while (prochain < taches.length) {
      const i = prochain++;
      resultats[i] = await taches[i]();
    }
  }

  const nombreOuvriers = Math.min(limite, taches.length);
  await Promise.all(Array.from({ length: nombreOuvriers }, ouvrier));
  return resultats;
}
