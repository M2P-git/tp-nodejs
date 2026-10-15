// Correction de l'exercice 5 (conditions : ternaire, ?? et ?.)

export function nomAffiche(utilisateur) {
  // ?. évite l'erreur si une étape manque ; ?? ne remplace que null et undefined (pas '')
  return utilisateur?.profil?.nom ?? 'Anonyme';
}

export function libelleCreneau(places) {
  if (places > 5) return 'libre';
  if (places >= 1) return 'bientôt complet';
  return 'complet';
}

export function prixAvecRemise(prix, vip) {
  return vip ? Math.round(prix * 0.8) : prix;
}
