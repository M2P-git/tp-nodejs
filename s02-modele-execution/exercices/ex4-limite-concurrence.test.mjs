import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as attendre } from 'node:timers/promises';
import { executerAvecLimite } from './ex4-limite-concurrence.mjs';

// Fabrique des tâches instrumentées qui mesurent la concurrence réelle
function fabriquerTaches(durees) {
  const etat = { enCours: 0, maximum: 0, demarrees: 0 };
  const taches = durees.map((ms, i) => async () => {
    etat.demarrees++;
    etat.enCours++;
    etat.maximum = Math.max(etat.maximum, etat.enCours);
    await attendre(ms);
    etat.enCours--;
    return `résultat-${i}`;
  });
  return { taches, etat };
}

test("renvoie les résultats dans l'ordre des tâches", async () => {
  const { taches } = fabriquerTaches([50, 10, 30, 5, 20]);
  assert.deepEqual(await executerAvecLimite(taches, 2), [
    'résultat-0', 'résultat-1', 'résultat-2', 'résultat-3', 'résultat-4',
  ]);
});

test('ne dépasse jamais la limite, et l’atteint', async () => {
  const { taches, etat } = fabriquerTaches(Array(20).fill(10));
  await executerAvecLimite(taches, 5);
  assert.equal(etat.maximum, 5);
  assert.equal(etat.demarrees, 20);
});

test('une tâche démarre dès qu’une place se libère (pas de paquets)', async () => {
  // limite 2 : [100, 10, 10, 10] → la tâche longue occupe une place,
  // les 3 courtes se succèdent dans l'autre : ≈ 100 ms au total (par paquets : ≈ 110 ms)
  const { taches } = fabriquerTaches([100, 10, 10, 10, 10, 10, 10, 10]);
  const debut = performance.now();
  await executerAvecLimite(taches, 2);
  const duree = performance.now() - debut;
  assert.ok(duree < 150, `durée : ${Math.round(duree)} ms (attendu ≈ 100 ms)`);
});

test('gère une liste vide et une limite supérieure au nombre de tâches', async () => {
  assert.deepEqual(await executerAvecLimite([], 3), []);
  const { taches, etat } = fabriquerTaches([10, 10]);
  assert.equal((await executerAvecLimite(taches, 10)).length, 2);
  assert.equal(etat.maximum, 2);
});

test("rejette si une tâche échoue", async () => {
  const taches = [async () => 1, async () => { throw new Error('SMS refusé'); }, async () => 3];
  await assert.rejects(executerAvecLimite(taches, 2), /SMS refusé/);
});
