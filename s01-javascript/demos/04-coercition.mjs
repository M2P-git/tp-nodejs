// Séance 1 (idée n°7) : typage dynamique et conversions implicites.
// Ce qui arrive du réseau (query string, formulaire, JSON) n'a PAS le type que vous croyez.
//   node 04-coercition.mjs

const query = { places: '2', prix: '15' }; // tout ce qui vient d'une URL est une CHAÎNE

console.log(query.places + 1); // ?
console.log(query.prix * 2); // ?
console.log(0.1 + 0.2 === 0.3); // ? (d'où : stocker les montants en centimes, en entiers)
console.log(typeof null, typeof [], typeof NaN); // ?
console.log(NaN === NaN, Number.isNaN(Number('abc'))); // ?
console.log('0' == false, Boolean('0'), Boolean('')); // ?
console.log([10, 9, 1].sort()); // ? (tri par défaut = tri de CHAÎNES)

// Conséquence pour une API : on VALIDE et on CONVERTIT toutes les entrées à la frontière
// (séance 5 : Zod), et on utilise === partout.
