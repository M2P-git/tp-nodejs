import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formaterReservation, slugifier, initiales } from './ex1-chaines.mjs';

test('formaterReservation met « places » au pluriel', () => {
  assert.equal(formaterReservation('Awa', '10h', 2), 'Awa : 2 places à 10h');
  assert.equal(formaterReservation('Marc', '14h30', 3), 'Marc : 3 places à 14h30');
});

test('formaterReservation met « place » au singulier', () => {
  assert.equal(formaterReservation('Awa', '10h', 1), 'Awa : 1 place à 10h');
});

test('slugifier met en minuscules et relie les mots par des tirets', () => {
  assert.equal(slugifier('Salon Glow Lyon'), 'salon-glow-lyon');
});

test('slugifier ignore les espaces en trop', () => {
  assert.equal(slugifier('  Salon   Glow Lyon '), 'salon-glow-lyon');
});

test('initiales retourne les majuscules de chaque mot', () => {
  assert.equal(initiales('Awa Diop'), 'AD');
  assert.equal(initiales('marie claire dupont'), 'MCD');
});

test('initiales fonctionne avec un seul mot', () => {
  assert.equal(initiales('marc'), 'M');
});
