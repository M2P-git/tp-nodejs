import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  chiffreAffaires,
  nomsDesClients,
  premiereAnnulee,
  triParPrixDecroissant,
} from './ex3-tableaux.mjs';

const reservations = () => [
  { client: 'Marc', prix: 30, statut: 'confirmée' },
  { client: 'Awa', prix: 45, statut: 'annulée' },
  { client: 'Awa', prix: 20, statut: 'confirmée' },
  { client: 'Léa', prix: 60, statut: 'confirmée' },
];

test('chiffreAffaires ne compte que les réservations confirmées', () => {
  assert.equal(chiffreAffaires(reservations()), 110);
});

test('chiffreAffaires vaut 0 pour un tableau vide', () => {
  assert.equal(chiffreAffaires([]), 0);
});

test('nomsDesClients supprime les doublons et trie', () => {
  assert.deepEqual(nomsDesClients(reservations()), ['Awa', 'Léa', 'Marc']);
});

test('premiereAnnulee retourne la première réservation annulée', () => {
  assert.deepEqual(premiereAnnulee(reservations()), { client: 'Awa', prix: 45, statut: 'annulée' });
});

test('premiereAnnulee retourne undefined s\'il n\'y en a aucune', () => {
  assert.equal(premiereAnnulee([{ client: 'Marc', prix: 30, statut: 'confirmée' }]), undefined);
});

test('triParPrixDecroissant trie du plus cher au moins cher', () => {
  const prix = triParPrixDecroissant(reservations()).map((r) => r.prix);
  assert.deepEqual(prix, [60, 45, 30, 20]);
});

test('triParPrixDecroissant ne modifie pas le tableau d\'origine', () => {
  const original = reservations();
  triParPrixDecroissant(original);
  assert.equal(original[0].client, 'Marc');
});
