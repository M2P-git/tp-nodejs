import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as attendre } from 'node:timers/promises';
import { chargerTableauDeBord } from './ex2-tableau-de-bord.mjs';

function apiFactice({ statsEnEchec = false, profilEnEchec = false } = {}) {
  return {
    profil: () => attendre(100).then(() => {
      if (profilEnEchec) throw new Error('profil indisponible');
      return { id: 1, nom: 'Salon Awa' };
    }),
    reservations: () => attendre(100).then(() => [{ id: 10 }, { id: 11 }]),
    statistiques: () => attendre(100).then(() => {
      if (statsEnEchec) throw new Error('service de statistiques en panne');
      return { semaine: 42 };
    }),
    recommandations: (profil) => attendre(100).then(() => [`promo pour ${profil.nom}`]),
  };
}

test('renvoie toutes les données attendues', async () => {
  assert.deepEqual(await chargerTableauDeBord(apiFactice()), {
    profil: { id: 1, nom: 'Salon Awa' },
    reservations: [{ id: 10 }, { id: 11 }],
    statistiques: { semaine: 42 },
    recommandations: ['promo pour Salon Awa'],
  });
});

test('répond en moins de 250 ms', async () => {
  const debut = performance.now();
  await chargerTableauDeBord(apiFactice());
  const duree = performance.now() - debut;
  assert.ok(duree < 250, `durée mesurée : ${Math.round(duree)} ms`);
});

test('une panne des statistiques ne casse pas le tableau de bord', async () => {
  const resultat = await chargerTableauDeBord(apiFactice({ statsEnEchec: true }));
  assert.equal(resultat.statistiques, null);
  assert.equal(resultat.reservations.length, 2);
});

test('une panne du profil est propagée', async () => {
  await assert.rejects(chargerTableauDeBord(apiFactice({ profilEnEchec: true })), /profil indisponible/);
});
