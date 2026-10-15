import { test } from 'node:test';
import assert from 'node:assert/strict';
import { attendre, doublerApres, lireJsonSecurise } from './ex7-asynchrone.mjs';

test('attendre retourne une promesse', () => {
  const p = attendre(1);
  assert.ok(p instanceof Promise);
  return p;
});

test('attendre se règle après le délai demandé', async () => {
  const debut = Date.now();
  await attendre(40);
  assert.ok(Date.now() - debut >= 35, 'la promesse s\'est réglée trop tôt');
});

test('doublerApres retourne le double après le délai', async () => {
  assert.equal(await doublerApres(10, 21), 42);
  assert.equal(await doublerApres(0, 5), 10);
});

test('lireJsonSecurise lit un JSON valide', () => {
  assert.deepEqual(lireJsonSecurise('{"heure":"10h","libre":true}'), { heure: '10h', libre: true });
  assert.deepEqual(lireJsonSecurise('[1,2,3]'), [1, 2, 3]);
});

test('lireJsonSecurise retourne null sur un JSON invalide', () => {
  assert.equal(lireJsonSecurise('{oups'), null);
  assert.equal(lireJsonSecurise(''), null);
});
