import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compterPremiers, compterPremiersSansBloquer } from './ex5-bonus-ne-pas-bloquer.mjs';

test('donne le même résultat que la version bloquante', async () => {
  assert.equal(await compterPremiersSansBloquer(100_000), compterPremiers(100_000));
});

test('laisse les minuteurs s’exécuter pendant le calcul', async () => {
  let battements = 0;
  const intervalle = setInterval(() => battements++, 5);
  try {
    await compterPremiersSansBloquer(3_000_000);
  } finally {
    clearInterval(intervalle);
  }
  assert.ok(battements >= 5, `seulement ${battements} battement(s) pendant le calcul : la boucle a été bloquée`);
});
