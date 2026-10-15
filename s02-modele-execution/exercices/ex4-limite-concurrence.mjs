// Exercice 4 : limiter la concurrence
//
// executerAvecLimite(taches, limite) :
//   - « taches » est un tableau de fonctions async sans argument : () => Promise<valeur> ;
//   - exécute TOUTES les tâches, mais jamais plus de « limite » en même temps ;
//   - dès qu'une tâche se termine, la suivante démarre (pas d'attente « par paquets ») ;
//   - renvoie les résultats DANS L'ORDRE du tableau de tâches ;
//   - si une tâche échoue, la promesse retournée rejette (comme Promise.all).
//
// Cas réel : envoyer 2 000 rappels SMS la veille des rendez-vous, sans dépasser les
// 5 requêtes simultanées autorisées par l'API du fournisseur.
// Pourquoi pas Promise.all(taches.map((t) => t())) ? Que se passerait-il ?
//
// Interdit : utiliser une bibliothèque (p-limit, etc.). Le but est de comprendre.
// Vérification (depuis le dossier de la séance) :  node --test

export async function executerAvecLimite(taches, limite) {
  // TODO
  throw new Error('À implémenter');
}
