// Module ES (ESM), le standard du langage, à utiliser pour tout nouveau projet.
//   node demos/03-modules/moderne.mjs
import path from 'node:path'; // les import sont analysés AVANT l'exécution (statiques)
import { tarifTTC } from './ancien.cjs'; // un module ES peut importer du CommonJS

export const DEVISE = 'EUR';
export function formaterPrix(centimes) {
  return `${(centimes / 100).toFixed(2)} ${DEVISE}`;
}

// En ESM : pas de __dirname/__filename, mais import.meta
console.log('import.meta.dirname :', path.basename(import.meta.dirname));
console.log('import.meta.filename :', path.basename(import.meta.filename));
console.log('Prix TTC :', formaterPrix(tarifTTC(2500)));

// Top-level await : autorisé en ESM (pas en CommonJS)
const { setTimeout: attendre } = await import('node:timers/promises'); // import() dynamique
await attendre(10);
console.log('fin');
