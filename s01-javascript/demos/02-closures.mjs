// Séance 1 (idée n°4) : une fonction « se souvient » de l'endroit où elle a été créée.
//   node 02-closures.mjs

// a) État privé : personne ne peut modifier « compte » sans passer par la fonction
function creerCompteur() {
  let compte = 0;
  return () => ++compte;
}
const prochainNumero = creerCompteur();
console.log(prochainNumero(), prochainNumero(), prochainNumero()); // ?

// b) Fabrique de middlewares : c'est EXACTEMENT ainsi qu'Express est utilisé (séance 5)
function exigerRole(role) {
  return (utilisateur) => (utilisateur.roles.includes(role) ? 'accès autorisé' : '403 interdit');
}
const reserveAuxAdmins = exigerRole('admin');
console.log(reserveAuxAdmins({ roles: ['client'] })); // ?
console.log(reserveAuxAdmins({ roles: ['admin'] })); // ?

// c) Le piège classique : var (portée de fonction) vs let (portée de bloc)
for (var i = 1; i <= 3; i++) setTimeout(() => console.log('var :', i), 0);
for (let j = 1; j <= 3; j++) setTimeout(() => console.log('let :', j), 0);
// Pourquoi « var » affiche-t-il trois fois la même valeur ?
