import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as attendre } from 'node:timers/promises';
import { avecDelai, ErreurDelai } from './ex3-avec-delai.mjs';

test('renvoie le résultat si la fonction est assez rapide', async () => {
  assert.equal(await avecDelai(async () => 'ok', 100), 'ok');
});

test('rejette avec une ErreurDelai si la fonction est trop lente', async () => {
  const debut = performance.now();
  await assert.rejects(avecDelai(() => attendre(1000), 50), ErreurDelai);
  assert.ok(performance.now() - debut < 500, "le rejet doit arriver vers 50 ms, pas à la fin de l'attente");
});

test('annule le signal transmis quand le délai est dépassé', async () => {
  let signalRecu;
  await assert.rejects(
    avecDelai((signal) => {
      signalRecu = signal;
      return attendre(1000, null, { signal }).catch(() => {});
    }, 30),
    ErreurDelai,
  );
  assert.ok(signalRecu instanceof AbortSignal, 'fn doit recevoir un AbortSignal');
  assert.equal(signalRecu.aborted, true);
});

test("propage l'erreur de la fonction", async () => {
  await assert.rejects(
    avecDelai(async () => {
      throw new Error('fournisseur SMS : 503');
    }, 100),
    /503/,
  );
});

test("ne laisse aucun minuteur actif quand la fonction répond à temps", async () => {
  const avant = process.getActiveResourcesInfo().filter((r) => r === 'Timeout').length;
  await avecDelai(async () => 'ok', 60_000);
  const apres = process.getActiveResourcesInfo().filter((r) => r === 'Timeout').length;
  assert.equal(apres, avant, 'un setTimeout de 60 s est resté actif');
});
