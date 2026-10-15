// Exercice 1 : prédiction de l'ordre d'affichage (CORRECTION)
//
// Raisonnement, tour par tour :
//  1. Code synchrone du module : A, puis J (le corps d'une fonction async s'exécute de façon
//     synchrone jusqu'au premier await), puis L.
//  2. Fin de l'évaluation du module. Dans un MODULE ES, cette évaluation se fait elle-même
//     dans une tâche de promesse : la file des microtâches est vidée AVANT la file nextTick.
//     Microtâches dans l'ordre d'enregistrement : C (Promise.then), puis K (suite après await).
//  3. File nextTick : D.
//     (Dans un fichier CommonJS, D passerait avant C et K.)
//  4. Boucle d'événements, phase timers : B (setTimeout 0, son délai d'1 ms est écoulé).
//     readFile n'est pas encore terminé : il enchaîne open, fstat, read et close dans le
//     pool de threads, ce qui prend plusieurs tours de boucle.
//  5. Phase poll : le callback de readFile s'exécute → E.
//     Il programme F (timers), G (check), H (nextTick), I (microtâche).
//  6. Juste après ce callback : file nextTick d'abord (H), puis microtâches (I).
//     On n'est plus dans l'évaluation du module : c'est l'ordre « normal ».
//  7. Après poll vient la phase check : G (setImmediate).
//  8. Tour suivant, phase timers : F.
//
// Ordre vérifié sur 30 exécutions consécutives (Node 24) : toujours identique.

export const prediction = ['A', 'J', 'L', 'C', 'K', 'D', 'B', 'E', 'H', 'I', 'G', 'F'];
