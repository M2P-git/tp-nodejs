// Séance 2 (await en série vs Promise.all) : la différence se mesure.
import { setTimeout as attendre } from 'node:timers/promises';

// Simule 3 appels réseau indépendants (API météo, base de données, service de paiement)
const appel = (nom, ms) => attendre(ms).then(() => nom);

console.time('séquentiel');
const a = await appel('profil', 300);
const b = await appel('réservations', 300);
const c = await appel('factures', 300);
console.timeEnd('séquentiel'); // ≈ 900 ms : chaque await attend le précédent

console.time('parallèle');
const [x, y, z] = await Promise.all([
  appel('profil', 300),
  appel('réservations', 300),
  appel('factures', 300),
]);
console.timeEnd('parallèle'); // ≈ 300 ms : les trois attentes se chevauchent

// Et si l'un des appels échoue ? Promise.all rejette dès le premier échec.
// Promise.allSettled attend tout le monde et donne le statut de chacun.
const resultats = await Promise.allSettled([
  appel('ok', 50),
  Promise.reject(new Error('service de paiement indisponible')),
]);
console.log(resultats.map((r) => r.status)); // [ 'fulfilled', 'rejected' ]
