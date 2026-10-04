import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normaliserRecherche } from './ex3-normaliser.mjs';
import { ErreurValidation } from './erreurs.mjs';

const champsInvalides = (query) => {
  try {
    normaliserRecherche(query);
  } catch (e) {
    assert.ok(e instanceof ErreurValidation, `ErreurValidation attendue, reçu : ${e}`);
    return e.champs;
  }
  assert.fail('une ErreurValidation était attendue');
};

test('convertit les chaînes en nombres', () => {
  assert.deepEqual(normaliserRecherche({ date: '2026-10-10', duree: '45', places: '2' }), {
    date: '2026-10-10',
    duree: 45,
    places: 2,
  });
});

test('applique les valeurs par défaut', () => {
  assert.deepEqual(normaliserRecherche({ date: '2026-10-10' }), {
    date: '2026-10-10',
    duree: 30,
    places: 1,
  });
});

test('la date est obligatoire et doit exister dans le calendrier', () => {
  assert.deepEqual(champsInvalides({}), ['date']);
  assert.deepEqual(champsInvalides({ date: '10/10/2026' }), ['date']);
  assert.deepEqual(champsInvalides({ date: '2026-02-30' }), ['date']);
  assert.deepEqual(champsInvalides({ date: '2026-13-01' }), ['date']);
  assert.deepEqual(normaliserRecherche({ date: '2028-02-29' }).date, '2028-02-29'); // bissextile
});

test('la durée doit être 15, 30, 45 ou 60', () => {
  assert.deepEqual(champsInvalides({ date: '2026-10-10', duree: '20' }), ['duree']);
  assert.deepEqual(champsInvalides({ date: '2026-10-10', duree: '30.0' }), ['duree']);
  assert.deepEqual(champsInvalides({ date: '2026-10-10', duree: '' }), ['duree']);
});

test('le nombre de places est un entier de 1 à 5', () => {
  for (const places of ['0', '6', '2.5', ' 3', '3abc', 'abc', '', '-1']) {
    assert.deepEqual(champsInvalides({ date: '2026-10-10', places }), ['places'], `places='${places}'`);
  }
});

test('signale tous les champs invalides en une fois', () => {
  assert.deepEqual(champsInvalides({ date: 'demain', duree: '5', places: '99' }), [
    'date',
    'duree',
    'places',
  ]);
});
