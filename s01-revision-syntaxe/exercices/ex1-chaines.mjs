// Correction de l'exercice 1 (chaînes de caractères et template literals)

export function formaterReservation(client, heure, places) {
  // le template literal insère les valeurs ; l'expression conditionnelle gère le pluriel
  return `${client} : ${places} place${places > 1 ? 's' : ''} à ${heure}`;
}

export function slugifier(texte) {
  // trim() retire les espaces aux extrémités ; /\s+/ coupe sur un ou plusieurs espaces
  return texte.trim().toLowerCase().split(/\s+/).join('-');
}

export function initiales(nomComplet) {
  return nomComplet
    .trim()
    .split(/\s+/)
    .map((mot) => mot[0].toUpperCase())
    .join('');
}
