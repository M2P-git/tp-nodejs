import { test } from 'node:test';
import assert from 'node:assert/strict';
import { creerLimiteur } from './ex2-limiteur.mjs';

// Une horloge que l'on fait avancer à la main
function horlogeFactice() {
  let t = 0;
  return { maintenant: () => t, avancer: (ms) => (t += ms) };
}

test('autorise exactement « max » appels dans la fenêtre', () => {
  const h = horlogeFactice();
  const autoriser = creerLimiteur(3, 1000, h.maintenant);
  assert.deepEqual(
    [autoriser('ip1'), autoriser('ip1'), autoriser('ip1'), autoriser('ip1')],
    [true, true, true, false],
  );
});

test('chaque clé a son propre compteur', () => {
  const h = horlogeFactice();
  const autoriser = creerLimiteur(1, 1000, h.maintenant);
  assert.equal(autoriser('ip1'), true);
  assert.equal(autoriser('ip2'), true);
  assert.equal(autoriser('ip1'), false);
});

test('le compteur repart à zéro quand la fenêtre est écoulée', () => {
  const h = horlogeFactice();
  const autoriser = creerLimiteur(2, 1000, h.maintenant);
  autoriser('ip1');
  autoriser('ip1');
  assert.equal(autoriser('ip1'), false);
  h.avancer(999);
  assert.equal(autoriser('ip1'), false);
  h.avancer(1);
  assert.equal(autoriser('ip1'), true);
});

test('deux limiteurs ne partagent pas leur état', () => {
  const h = horlogeFactice();
  const connexion = creerLimiteur(1, 1000, h.maintenant);
  const inscription = creerLimiteur(1, 1000, h.maintenant);
  assert.equal(connexion('ip1'), true);
  assert.equal(inscription('ip1'), true);
});

test("fonctionne avec l'horloge réelle par défaut", () => {
  const autoriser = creerLimiteur(1, 60_000);
  assert.equal(autoriser('ip1'), true);
  assert.equal(autoriser('ip1'), false);
});
