// Module CommonJS (le système historique de Node, encore très présent dans les projets existants).
//   node demos/03-modules/ancien.cjs
const path = require('node:path'); // chargement SYNCHRONE, peut être appelé n'importe où

function tarifTTC(ht, tva = 0.2) {
  return Math.round(ht * (1 + tva));
}

module.exports = { tarifTTC }; // ce qu'on exporte = la valeur de module.exports

if (require.main === module) {
  // vrai seulement si ce fichier est lancé directement (et non importé)
  console.log('__dirname :', __dirname); // variables injectées par CommonJS
  console.log('__filename :', path.basename(__filename));
  console.log('tarifTTC(1000) =', tarifTTC(1000));
}
