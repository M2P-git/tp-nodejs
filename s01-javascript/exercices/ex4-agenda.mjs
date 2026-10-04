// Exercice 4 : classes, « this » et événements
//
// Complétez la classe Agenda (elle hérite d'EventEmitter) :
//   - reserver(creneau, client)
//       • si le créneau est déjà pris : lever une ErreurMetier (statusHttp 409) ;
//       • sinon : enregistrer la réservation et émettre 'reservation' avec { creneau, client }.
//   - annuler(creneau)
//       • si le créneau n'est pas réservé : lever une ErreurMetier (statusHttp 404) ;
//       • sinon : libérer le créneau et émettre 'annulation' avec { creneau, client }.
//   - creneauxPris() : tableau des créneaux réservés, triés par ordre croissant
//       (les créneaux sont des chaînes 'HH:MM', ex. '09:30').
//
// Puis écrivez brancherNotifications(agenda, journal) qui abonne deux écouteurs :
//   'reservation' → journal.push(`confirmation:${client}`)
//   'annulation'  → journal.push(`annulation:${client}`)
//
// Vérification (depuis le dossier de la séance) :  node --test
import { EventEmitter } from 'node:events';
import { ErreurMetier } from './erreurs.mjs';

export class Agenda extends EventEmitter {
  // TODO
}

export function brancherNotifications(agenda, journal) {
  // TODO
}
