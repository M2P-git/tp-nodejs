// Correction de l'exercice 3 (tableaux : map, filter, reduce, find, sort)

export function chiffreAffaires(reservations) {
  return reservations
    .filter((r) => r.statut === 'confirmée')
    .reduce((total, r) => total + r.prix, 0);
}

export function nomsDesClients(reservations) {
  // Set supprime les doublons ; [...set] le retransforme en tableau
  return [...new Set(reservations.map((r) => r.client))].sort((a, b) => a.localeCompare(b));
}

export function premiereAnnulee(reservations) {
  // find retourne le premier élément qui convient, ou undefined
  return reservations.find((r) => r.statut === 'annulée');
}

export function triParPrixDecroissant(reservations) {
  // sort MODIFIE le tableau : on trie donc une copie ([...reservations])
  return [...reservations].sort((a, b) => b.prix - a.prix);
}
