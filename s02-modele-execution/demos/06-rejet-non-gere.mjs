// Séance 2 : une promesse rejetée sans .catch() ARRÊTE le processus (Node ≥ 15).
// try/catch ne capture PAS une erreur levée plus tard dans un callback.
import { setTimeout as attendre } from 'node:timers/promises';

try {
  setTimeout(() => {
    // Ce throw arrive dans un AUTRE tour de boucle : le try/catch est déjà terminé.
    // throw new Error('perdu !');   // ← décommentez : le processus plante
  }, 10);
} catch (e) {
  console.log('jamais affiché');
}

async function chargerReservation(id) {
  await attendre(10);
  throw new Error(`Réservation ${id} introuvable`);
}

// ✅ Correct : on attend la promesse dans un try/catch
try {
  await chargerReservation(42);
} catch (e) {
  console.log('Erreur gérée :', e.message);
}

// ❌ Incorrect : promesse « flottante », personne ne l'attend ni ne la .catch()
chargerReservation(7); // → crash : « Réservation 7 introuvable »

await attendre(50);
console.log('Cette ligne ne sera jamais affichée.');
