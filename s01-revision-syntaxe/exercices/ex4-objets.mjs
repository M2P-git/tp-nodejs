// Correction de l'exercice 4 (objets : spread, destructuring, immutabilité)

export function avecAcompte(reservation, acompte) {
  // le spread copie les champs ; « acompte » (forme abrégée de acompte: acompte) s'ajoute
  return { ...reservation, acompte };
}

export function sansChamp(objet, cle) {
  // [cle] est un nom de champ calculé ; « reste » reçoit tous les autres champs
  const { [cle]: _retire, ...reste } = objet;
  return reste;
}

export function compterParStatut(reservations) {
  const compte = {};
  for (const r of reservations) {
    compte[r.statut] = (compte[r.statut] ?? 0) + 1;
  }
  return compte;
}
