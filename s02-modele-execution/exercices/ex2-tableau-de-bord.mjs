// Exercice 2 : paralléliser les attentes (sans changer le résultat)
//
// chargerTableauDeBord(api) construit l'écran d'accueil d'un salon. L'objet api fournit :
//   api.profil()                   → Promise<profil>          (≈ 100 ms)
//   api.reservations()             → Promise<reservations>    (≈ 100 ms)
//   api.statistiques()             → Promise<statistiques>    (≈ 100 ms)
//   api.recommandations(profil)    → Promise<recommandations> (≈ 100 ms), a BESOIN du profil
//
// La version actuelle attend chaque appel l'un après l'autre : ≈ 400 ms.
// Objectifs :
//   1. Même résultat, en moins de 250 ms (quelles attentes sont réellement dépendantes ?).
//   2. Les statistiques sont FACULTATIVES : si api.statistiques() échoue, renvoyer
//      statistiques: null au lieu de faire échouer tout le tableau de bord.
//      Toute autre erreur doit, elle, être propagée.
//
// Vérification (depuis le dossier de la séance) :  node --test

export async function chargerTableauDeBord(api) {
  const profil = await api.profil();
  const reservations = await api.reservations();
  const statistiques = await api.statistiques();
  const recommandations = await api.recommandations(profil);
  return { profil, reservations, statistiques, recommandations };
}
