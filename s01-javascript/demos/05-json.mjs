// Séance 1 (idée n°9) : JSON est la langue des API… mais ce n'est pas JavaScript.
//   node 05-json.mjs
const reservation = {
  id: 1,
  debut: new Date('2026-10-04T10:00:00Z'),
  note: undefined,
  tags: new Set(['vip']),
  rappel() {
    return 'J-1';
  },
};

const texte = JSON.stringify(reservation);
console.log(texte); // ? Que sont devenus debut, note, tags et rappel ?

const relu = JSON.parse(texte);
console.log(typeof relu.debut); // ? (une date redevient… une chaîne)

try {
  JSON.stringify({ montant: 10n }); // BigInt
} catch (e) {
  console.log('Erreur :', e.message);
}
