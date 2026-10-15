// Correction de l'exercice 2 (fonctions : paramètres par défaut, rest, closures)

export function acompte(prixCentimes, taux = 0.3) {
  // Math.round arrondit : un montant en centimes reste un entier
  return Math.round(prixCentimes * taux);
}

export function somme(...nombres) {
  // « nombres » est un vrai tableau ; la valeur initiale 0 couvre le cas « aucun argument »
  return nombres.reduce((total, n) => total + n, 0);
}

export function creerMultiplicateur(facteur) {
  // la fonction retournée garde « facteur » en mémoire : c'est une closure
  return (n) => n * facteur;
}
