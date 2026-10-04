import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { Agenda, brancherNotifications } from './ex4-agenda.mjs';
import { ErreurMetier } from './erreurs.mjs';

test('Agenda est un EventEmitter', () => {
  assert.ok(new Agenda() instanceof EventEmitter);
});

test('réserver émet un événement avec le créneau et le client', () => {
  const agenda = new Agenda();
  const recus = [];
  agenda.on('reservation', (e) => recus.push(e));
  agenda.reserver('10:00', 'Awa');
  assert.deepEqual(recus, [{ creneau: '10:00', client: 'Awa' }]);
});

test('un créneau ne peut pas être réservé deux fois (409)', () => {
  const agenda = new Agenda();
  agenda.reserver('10:00', 'Awa');
  assert.throws(() => agenda.reserver('10:00', 'Marc'), (e) => e instanceof ErreurMetier && e.statusHttp === 409);
});

test('annuler libère le créneau et émet un événement', () => {
  const agenda = new Agenda();
  const recus = [];
  agenda.on('annulation', (e) => recus.push(e));
  agenda.reserver('10:00', 'Awa');
  agenda.annuler('10:00');
  assert.deepEqual(recus, [{ creneau: '10:00', client: 'Awa' }]);
  agenda.reserver('10:00', 'Marc'); // de nouveau libre
});

test('annuler un créneau libre lève une erreur 404', () => {
  assert.throws(() => new Agenda().annuler('08:00'), (e) => e instanceof ErreurMetier && e.statusHttp === 404);
});

test('creneauxPris renvoie les créneaux triés', () => {
  const agenda = new Agenda();
  agenda.reserver('14:30', 'A');
  agenda.reserver('09:00', 'B');
  agenda.reserver('11:15', 'C');
  assert.deepEqual(agenda.creneauxPris(), ['09:00', '11:15', '14:30']);
});

test('deux agendas sont indépendants', () => {
  const a = new Agenda();
  const b = new Agenda();
  a.reserver('10:00', 'Awa');
  b.reserver('10:00', 'Marc'); // ne doit pas lever d'erreur
  assert.deepEqual(a.creneauxPris(), ['10:00']);
});

test('brancherNotifications alimente le journal', () => {
  const agenda = new Agenda();
  const journal = [];
  brancherNotifications(agenda, journal);
  agenda.reserver('10:00', 'Awa');
  agenda.annuler('10:00');
  assert.deepEqual(journal, ['confirmation:Awa', 'annulation:Awa']);
});

test('la méthode reserver fonctionne une fois détachée et liée (bind)', () => {
  const agenda = new Agenda();
  const reserver = agenda.reserver.bind(agenda);
  reserver('16:00', 'Inès');
  assert.deepEqual(agenda.creneauxPris(), ['16:00']);
});
