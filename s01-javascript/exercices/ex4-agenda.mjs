// Exercice 4 : classes, « this » et événements (CORRECTION)
//
// Points clés :
//  - Les réservations sont un champ d'INSTANCE (#reservations), initialisé pour chaque
//    agenda : deux agendas ne partagent rien. Le « # » rend le champ réellement privé.
//  - Ne pas oublier super() dans un constructeur de classe dérivée ; ici on s'en passe
//    grâce à la déclaration de champ, qui est initialisée après l'appel implicite à super().
//  - L'Agenda ne connaît PAS ses abonnés (email, SMS, statistiques…) : il émet, c'est tout.
//    On peut ajouter un nouvel abonné sans toucher à la classe (principe ouvert/fermé).
//  - Les écouteurs sont appelés de façon synchrone : si un écouteur lève une erreur, elle
//    remonte dans reserver(). En production, un envoi d'email se fait en tâche de fond (S9).
import { EventEmitter } from 'node:events';
import { ErreurMetier } from './erreurs.mjs';

export class Agenda extends EventEmitter {
  #reservations = new Map(); // creneau -> client

  reserver(creneau, client) {
    if (this.#reservations.has(creneau)) {
      throw new ErreurMetier(`Le créneau ${creneau} est déjà réservé`, 409);
    }
    this.#reservations.set(creneau, client);
    this.emit('reservation', { creneau, client });
  }

  annuler(creneau) {
    const client = this.#reservations.get(creneau);
    if (client === undefined) {
      throw new ErreurMetier(`Aucune réservation sur le créneau ${creneau}`, 404);
    }
    this.#reservations.delete(creneau);
    this.emit('annulation', { creneau, client });
  }

  creneauxPris() {
    // Le format 'HH:MM' sur 2 chiffres permet un tri lexicographique correct
    return [...this.#reservations.keys()].sort();
  }
}

export function brancherNotifications(agenda, journal) {
  agenda.on('reservation', ({ client }) => journal.push(`confirmation:${client}`));
  agenda.on('annulation', ({ client }) => journal.push(`annulation:${client}`));
}
