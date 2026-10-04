// Séance 1 (idée n°2) : les objets sont partagés PAR RÉFÉRENCE.
// Prédisez les 3 affichages avant d'exécuter :  node 01-valeurs-et-references.mjs

// Un objet de configuration « par défaut », partagé par tout le serveur
const OPTIONS_PAR_DEFAUT = { devise: 'EUR', acompte: 0.3, notifications: ['email'] };

function creerReservation(client, options = OPTIONS_PAR_DEFAUT) {
  // ❌ Bug réel fréquent : on croit modifier « ses » options, on modifie celles de tout le monde
  if (client.vip) options.acompte = 0;
  options.notifications.push('sms');
  return { client: client.nom, ...options };
}

console.log(creerReservation({ nom: 'Awa', vip: true }));
console.log(creerReservation({ nom: 'Marc', vip: false })); // Marc ne paie plus d'acompte ?
console.log(OPTIONS_PAR_DEFAUT);

// ✅ Correctif : au lieu de muter une donnée partagée, en créer une copie.
//    structuredClone() fait une copie PROFONDE ; le spread { ...obj } est une copie SUPERFICIELLE.
// Bonus : « const » empêche de réaffecter la variable, PAS de modifier l'objet.
//         Object.freeze() rend l'objet non modifiable (superficiellement).
