import { test } from 'node:test';
import assert from 'node:assert/strict';
import { acompte, somme, creerMultiplicateur } from './ex2-fonctions.mjs';

test('acompte utilise 30 % par défaut', () => {
  assert.equal(acompte(10000), 3000);
});

test('acompte accepte un taux explicite et arrondit au centime', () => {
  assert.equal(acompte(10000, 0.5), 5000);
  assert.equal(acompte(1999), 600);
});

test('somme additionne un nombre quelconque d\'arguments', () => {
  assert.equal(somme(1, 2, 3), 6);
  assert.equal(somme(10), 10);
});

test('somme sans argument vaut 0', () => {
  assert.equal(somme(), 0);
});

test('creerMultiplicateur retourne une fonction', () => {
  assert.equal(typeof creerMultiplicateur(3), 'function');
  assert.equal(creerMultiplicateur(3)(5), 15);
});

test('chaque multiplicateur se souvient de SON facteur (closure)', () => {
  const x2 = creerMultiplicateur(2);
  const x10 = creerMultiplicateur(10);
  assert.equal(x2(4), 8);
  assert.equal(x10(4), 40);
});
