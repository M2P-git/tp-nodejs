// Séance 1 (idée n°3) : les fonctions sont des valeurs comme les autres.
// On les passe, on les retourne, on les stocke : TOUT Node.js repose là-dessus
// (callbacks, écouteurs d'événements, middlewares, promesses).
//   node 07-fonctions-valeurs.mjs

const reservations = [
  { client: 'Awa', service: 'coupe', prix: 2500, statut: 'confirmée' },
  { client: 'Marc', service: 'couleur', prix: 6000, statut: 'annulée' },
  { client: 'Inès', service: 'coupe', prix: 2500, statut: 'confirmée' },
];

// On décrit QUOI faire, en passant des fonctions à d'autres fonctions
const chiffreAffaires = reservations
  .filter((r) => r.statut === 'confirmée')
  .map((r) => r.prix)
  .reduce((total, prix) => total + prix, 0);
console.log(`CA confirmé : ${chiffreAffaires / 100} €`); // montants stockés en centimes

// Une fonction qui RETOURNE une fonction (fonction d'ordre supérieur)
const parStatut = (statut) => (r) => r.statut === statut;
console.log(reservations.filter(parStatut('annulée')).map((r) => r.client));

// Une fonction passée pour être appelée PLUS TARD : c'est un callback
setTimeout(() => console.log('rappel envoyé (plus tard)'), 0);
console.log('fin du script (maintenant)');
