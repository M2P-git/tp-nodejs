import { test } from 'node:test';
import assert from 'node:assert/strict';
import { avecAcompte, sansChamp, compterParStatut } from './ex4-objets.mjs';

test('avecAcompte ajoute le champ acompte', () => {
  const resultat = avecAcompte({ client: 'Awa', prix: 40 }, 12);
  assert.deepEqual(resultat, { client: 'Awa', prix: 40, acompte: 12 });
});

test('avecAcompte ne modifie pas la réservation d\'origine', () => {
  const original = { client: 'Awa', prix: 40 };
  const resultat = avecAcompte(original, 12);
  assert.notEqual(resultat, original);
  assert.equal(original.acompte, undefined);
});

test('sansChamp retire le champ demandé', () => {
  assert.deepEqual(sansChamp({ a: 1, b: 2, c: 3 }, 'b'), { a: 1, c: 3 });
});

test('sansChamp ne modifie pas l\'objet d\'origine', () => {
  const original = { a: 1, b: 2 };
  sansChamp(original, 'a');
  assert.deepEqual(original, { a: 1, b: 2 });
});

test('compterParStatut compte les réservations de chaque statut', () => {
  const reservations = [
    { client: 'Marc', statut: 'confirmée' },
    { client: 'Awa', statut: 'annulée' },
    { client: 'Awa', statut: 'confirmée' },
    { client: 'Léa', statut: 'confirmée' },
  ];
  assert.deepEqual(compterParStatut(reservations), { confirmée: 3, annulée: 1 });
});

test('compterParStatut retourne un objet vide pour un tableau vide', () => {
  assert.deepEqual(compterParStatut([]), {});
});
