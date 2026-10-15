// Contrat de la mini-API « créneaux » (fichier FOURNI, ne pas modifier).
// La même suite de tests vérifie l'exercice 2 (node:http) ET l'exercice 3 (Express) :
// si les deux passent, les deux implémentations sont interchangeables pour un client.
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';

export function verifierContrat(nom, creerServeur) {
  describe(nom, () => {
    let serveur;
    let base;

    before(async () => {
      serveur = creerServeur();
      await new Promise((resoudre) => serveur.listen(0, '127.0.0.1', resoudre)); // port 0 = port libre au hasard
      base = `http://127.0.0.1:${serveur.address().port}`;
    });

    after(async () => {
      serveur.closeAllConnections();
      await new Promise((resoudre) => serveur.close(resoudre));
    });

    const appeler = async (methode, chemin, { json, corps, type } = {}) => {
      const options = { method: methode, headers: {} };
      if (json !== undefined) {
        options.body = JSON.stringify(json);
        options.headers['Content-Type'] = 'application/json';
      }
      if (corps !== undefined) {
        options.body = corps;
        options.headers['Content-Type'] = type ?? 'application/json';
      }
      const reponse = await fetch(base + chemin, options);
      const texte = await reponse.text();
      let donnees;
      try {
        donnees = JSON.parse(texte);
      } catch {
        donnees = texte;
      }
      return { status: reponse.status, entetes: reponse.headers, donnees };
    };

    const verifierErreurJson = (r, status) => {
      assert.equal(r.status, status);
      assert.match(r.entetes.get('content-type') ?? '', /application\/json/, 'les erreurs aussi sont en JSON');
      assert.equal(typeof r.donnees.erreur, 'string', 'corps attendu : { "erreur": "message" }');
    };

    it('GET /sante → 200 { statut: "ok" }', async () => {
      const r = await appeler('GET', '/sante');
      assert.equal(r.status, 200);
      assert.match(r.entetes.get('content-type'), /application\/json/);
      assert.deepEqual(r.donnees, { statut: 'ok' });
    });

    it('GET /creneaux?date=… → 200 avec les 16 créneaux de la journée', async () => {
      const r = await appeler('GET', '/creneaux?date=2026-10-10');
      assert.equal(r.status, 200);
      assert.equal(r.donnees.date, '2026-10-10');
      assert.equal(r.donnees.creneaux.length, 16);
      assert.equal(r.donnees.creneaux[0], '09:00');
      assert.equal(r.donnees.creneaux.at(-1), '16:30');
    });

    it('GET /creneaux sans date ou avec une date invalide → 400', async () => {
      verifierErreurJson(await appeler('GET', '/creneaux'), 400);
      verifierErreurJson(await appeler('GET', '/creneaux?date=2026-02-30'), 400);
      verifierErreurJson(await appeler('GET', '/creneaux?date=demain'), 400);
    });

    it('POST /reservations → 201, en-tête Location, créneau retiré des disponibilités', async () => {
      const r = await appeler('POST', '/reservations', {
        json: { date: '2026-10-11', heure: '10:30', client: 'Awa' },
      });
      assert.equal(r.status, 201);
      assert.equal(typeof r.donnees.id, 'number');
      assert.deepEqual(
        { date: r.donnees.date, heure: r.donnees.heure, client: r.donnees.client },
        { date: '2026-10-11', heure: '10:30', client: 'Awa' },
      );
      assert.equal(r.entetes.get('location'), `/reservations/${r.donnees.id}`);

      const dispo = await appeler('GET', '/creneaux?date=2026-10-11');
      assert.equal(dispo.donnees.creneaux.length, 15);
      assert.ok(!dispo.donnees.creneaux.includes('10:30'));

      const relue = await appeler('GET', `/reservations/${r.donnees.id}`);
      assert.equal(relue.status, 200);
      assert.deepEqual(relue.donnees, r.donnees);
    });

    it('POST /reservations sur un créneau déjà pris → 409', async () => {
      const reservation = { date: '2026-10-12', heure: '14:00', client: 'Awa' };
      assert.equal((await appeler('POST', '/reservations', { json: reservation })).status, 201);
      verifierErreurJson(await appeler('POST', '/reservations', { json: { ...reservation, client: 'Marc' } }), 409);
    });

    it('POST /reservations avec un JSON mal formé → 400', async () => {
      verifierErreurJson(await appeler('POST', '/reservations', { corps: '{"date": "2026-10-13",' }), 400);
    });

    it('POST /reservations avec des champs invalides → 400', async () => {
      verifierErreurJson(await appeler('POST', '/reservations', { json: { date: '2026-10-13', heure: '10:00' } }), 400);
      verifierErreurJson(
        await appeler('POST', '/reservations', { json: { date: '2026-10-13', heure: '08:00', client: 'A' } }),
        400,
      );
      verifierErreurJson(
        await appeler('POST', '/reservations', { json: { date: '2026-10-13', heure: '09:15', client: 'A' } }),
        400,
      );
      verifierErreurJson(await appeler('POST', '/reservations', { json: [1, 2, 3] }), 400);
    });

    it('POST /reservations sans Content-Type JSON → 415', async () => {
      verifierErreurJson(await appeler('POST', '/reservations', { corps: 'bonjour', type: 'text/plain' }), 415);
    });

    it('POST /reservations avec un corps de plus de 10 Kio → 413', async () => {
      const client = 'x'.repeat(11 * 1024);
      verifierErreurJson(
        await appeler('POST', '/reservations', { json: { date: '2026-10-13', heure: '11:00', client } }),
        413,
      );
    });

    it('GET /reservations/:id inexistant et route inconnue → 404', async () => {
      verifierErreurJson(await appeler('GET', '/reservations/999999'), 404);
      verifierErreurJson(await appeler('GET', '/route-qui-n-existe-pas'), 404);
    });

    it('deux réservations SIMULTANÉES du même créneau → une seule réussit', async () => {
      const reservation = { date: '2026-10-14', heure: '09:00' };
      const statuts = (
        await Promise.all([
          appeler('POST', '/reservations', { json: { ...reservation, client: 'Awa' } }),
          appeler('POST', '/reservations', { json: { ...reservation, client: 'Marc' } }),
        ])
      )
        .map((r) => r.status)
        .sort();
      assert.deepEqual(statuts, [201, 409]);
    });
  });
}
