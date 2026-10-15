import { test } from 'node:test';
import assert from 'node:assert/strict';
import { totalPlaces, creerLecteurs, trierPrix } from './ex8-corriger.mjs';

test('totalPlaces additionne des nombres, même quand une valeur est une chaîne', () => {
  assert.equal(totalPlaces([{ places: '2' }, { places: 3 }]), 5);
  assert.equal(totalPlaces([]), 0);
});

test('creerLecteurs : chaque fonction se souvient de SON indice', () => {
  assert.deepEqual(creerLecteurs(3).map((lire) => lire()), [0, 1, 2]);
});

test('trierPrix trie les nombres par ordre croissant', () => {
  assert.deepEqual(trierPrix([30, 5, 100]), [5, 30, 100]);
});

test('trierPrix ne modifie pas le tableau reçu', () => {
  const original = [30, 5, 100];
  trierPrix(original);
  assert.deepEqual(original, [30, 5, 100]);
});
