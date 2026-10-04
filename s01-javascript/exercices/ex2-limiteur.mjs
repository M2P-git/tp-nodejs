// Exercice 2 (closures) : un limiteur de requêtes (protection anti-abus)
//
// creerLimiteur(max, fenetreMs) retourne une fonction autoriser(cle) qui renvoie :
//   - true  tant que « cle » (ex. une adresse IP) a fait moins de « max » appels
//           dans la fenêtre de temps courante ;
//   - false au-delà, jusqu'à ce que la fenêtre (fenetreMs) soit écoulée.
// Chaque clé a son propre compteur. Deux limiteurs ne partagent rien.
//
// Contraintes :
//   - aucune variable globale : l'état doit vivre DANS la closure ;
//   - pour pouvoir tester sans attendre, l'horloge est injectée (paramètre « maintenant »).
//
// Vérification (depuis le dossier de la séance) :  node --test

export function creerLimiteur(max, fenetreMs, maintenant = () => Date.now()) {
  // TODO
  throw new Error('À implémenter');
}
