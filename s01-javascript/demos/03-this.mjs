// Séance 1 (idée n°5) : « this » dépend de la façon dont la fonction est APPELÉE,
// pas de l'endroit où elle est écrite.
//   node 03-this.mjs

class ServiceReservation {
  constructor() {
    this.reservations = [];
  }
  ajouter(r) {
    this.reservations.push(r);
    return this.reservations.length;
  }
}
const service = new ServiceReservation();

console.log(service.ajouter('créneau 10h')); // appel « sur » l'objet : this = service

const ajouter = service.ajouter; // on détache la méthode (comme quand on la passe en callback)
try {
  ajouter('créneau 11h');
} catch (e) {
  console.log('Erreur :', e.message); // ?
}

// Solutions : lier explicitement, ou envelopper dans une fonction fléchée
const ajouterLiee = service.ajouter.bind(service);
console.log(ajouterLiee('créneau 12h'));
['13h', '14h'].forEach((h) => service.ajouter(`créneau ${h}`)); // la flèche n'a pas de this propre
console.log(service.reservations);
