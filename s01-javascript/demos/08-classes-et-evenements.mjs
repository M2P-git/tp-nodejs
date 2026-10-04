// Séance 1 (idée n°6) : prototypes, classes et EventEmitter.
// « class » est une syntaxe au-dessus des prototypes. Beaucoup d'objets de Node
// (serveur HTTP, streams, process) sont des EventEmitter : on s'abonne à des événements.
//   node 08-classes-et-evenements.mjs
import { EventEmitter } from 'node:events';

class Agenda extends EventEmitter {
  reserver(creneau) {
    // … enregistrement en base …
    this.emit('reservation', creneau); // on prévient les abonnés, sans les connaître
  }
}

const agenda = new Agenda();
agenda.on('reservation', (c) => console.log(`[email] confirmation envoyée pour ${c}`));
agenda.on('reservation', (c) => console.log(`[stats] tableau de bord mis à jour (${c})`));
agenda.reserver('samedi 10h');

console.log(Object.getPrototypeOf(agenda) === Agenda.prototype); // ?
console.log(Object.getPrototypeOf(Agenda.prototype) === EventEmitter.prototype); // ?
// Note : emit() appelle les écouteurs de façon SYNCHRONE, dans l'ordre d'abonnement.
