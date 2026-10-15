import { test } from 'node:test';
import assert from 'node:assert/strict';
import prixParDefaut, { TVA, prixTTC } from './ex6-tarifs.mjs';

test('TVA est exportée sous son nom', () => {
  assert.equal(TVA, 0.2);
});

test('prixTTC est exportée sous son nom et ajoute la TVA', () => {
  assert.equal(prixTTC(100), 120);
  assert.equal(prixTTC(50), 60);
});

test('prixTTC est aussi l\'export par défaut', () => {
  assert.equal(prixParDefaut, prixTTC);
});
