import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nomAffiche, libelleCreneau, prixAvecRemise } from './ex5-conditions.mjs';

test('nomAffiche retourne « Anonyme » quand il manque une information', () => {
  assert.equal(nomAffiche(undefined), 'Anonyme');
  assert.equal(nomAffiche({}), 'Anonyme');
  assert.equal(nomAffiche({ profil: {} }), 'Anonyme');
  assert.equal(nomAffiche({ profil: { nom: null } }), 'Anonyme');
});

test('nomAffiche retourne le nom quand il existe', () => {
  assert.equal(nomAffiche({ profil: { nom: 'Awa' } }), 'Awa');
});

test('nomAffiche conserve un nom vide (?? n\'est pas ||)', () => {
  assert.equal(nomAffiche({ profil: { nom: '' } }), '');
});

test('libelleCreneau selon le nombre de places', () => {
  assert.equal(libelleCreneau(8), 'libre');
  assert.equal(libelleCreneau(6), 'libre');
  assert.equal(libelleCreneau(5), 'bientôt complet');
  assert.equal(libelleCreneau(1), 'bientôt complet');
  assert.equal(libelleCreneau(0), 'complet');
});

test('prixAvecRemise applique 20 % aux clients VIP', () => {
  assert.equal(prixAvecRemise(10000, true), 8000);
  assert.equal(prixAvecRemise(1999, true), 1599);
});

test('prixAvecRemise ne change pas le prix des autres clients', () => {
  assert.equal(prixAvecRemise(10000, false), 10000);
});
