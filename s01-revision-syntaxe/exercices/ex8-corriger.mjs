// Correction de l'exercice 8 (chasse aux bugs)

// 1) BUG : les paramètres d'URL arrivent en TEXTE. '2' + 3 donne '23' (concaténation),
//    et 0 + '2' donne '02'.  Explication : le « + » concatène dès qu'un opérande est une chaîne.
//    CORRECTION : convertir à la frontière avec Number().
export function totalPlaces(reservations) {
  let total = 0;
  for (const r of reservations) {
    total = total + Number(r.places);
  }
  return total;
}

// 2) BUG : « var » a une portée de FONCTION : les trois callbacks partagent UNE seule variable i,
//    qui vaut 3 à la fin de la boucle.
//    CORRECTION : « let » crée une nouvelle variable à chaque tour de boucle.
export function creerLecteurs(n) {
  const lecteurs = [];
  for (let i = 0; i < n; i++) {
    lecteurs.push(() => i);
  }
  return lecteurs;
}

// 3) BUG : sort() sans fonction de comparaison trie comme du TEXTE ([100, 30, 5]),
//    et il MODIFIE le tableau d'origine.
//    CORRECTION : trier une copie, avec une comparaison numérique.
export function trierPrix(prix) {
  return [...prix].sort((a, b) => a - b);
}
