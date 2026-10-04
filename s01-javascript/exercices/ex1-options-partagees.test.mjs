import { test } from 'node:test';
import assert from 'node:assert/strict';
import { creerReservation, OPTIONS_PAR_DEFAUT } from './ex1-options-partagees.mjs';

const ETAT_INITIAL = structuredClone(OPTIONS_PAR_DEFAUT);

test("un client VIP ne paie pas d'acompte", () => {
  assert.equal(creerReservation({ nom: 'Awa', vip: true }).acompte, 0);
});

test("un client non VIP paie l'acompte par défaut, même après un VIP", () => {
  creerReservation({ nom: 'Awa', vip: true });
  assert.equal(creerReservation({ nom: 'Marc', vip: false }).acompte, 0.3);
});

test('les options par défaut ne sont jamais modifiées', () => {
  creerReservation({ nom: 'Awa', vip: true });
  creerReservation({ nom: 'Marc', vip: false });
  assert.deepEqual(OPTIONS_PAR_DEFAUT, ETAT_INITIAL);
});

test("les options fournies par l'appelant ne sont pas modifiées", () => {
  const options = { devise: 'XAF', acompte: 0.5, notifications: [] };
  const resultat = creerReservation({ nom: 'Inès', vip: true }, options);
  assert.deepEqual(options, { devise: 'XAF', acompte: 0.5, notifications: [] });
  assert.equal(resultat.devise, 'XAF');
  assert.equal(resultat.acompte, 0);
});

test("la notification 'sms' n'est ajoutée qu'une fois par réservation", () => {
  creerReservation({ nom: 'A', vip: false });
  const r = creerReservation({ nom: 'B', vip: false });
  assert.deepEqual(r.notifications, ['email', 'sms']);
});
