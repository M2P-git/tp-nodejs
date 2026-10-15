// Exercice 1 : valeurs et références (CORRECTION)
// Principe : on ne mute jamais une donnée qu'on ne possède pas. On travaille sur une copie.
// structuredClone() copie en profondeur : le tableau « notifications » est lui aussi dupliqué.
// (Avec un simple { ...options }, le tableau resterait partagé et push() le modifierait encore.)

export const OPTIONS_PAR_DEFAUT = { devise: 'EUR', acompte: 0.3, notifications: ['email'] };

export function creerReservation(client, options = OPTIONS_PAR_DEFAUT) {
  const copie = structuredClone(options);
  if (client.vip) copie.acompte = 0;
  copie.notifications.push('sms');
  return { client: client.nom, ...copie };
}

// Variante sans mutation du tout (style « immuable ») :
// return {
//   client: client.nom,
//   ...options,
//   acompte: client.vip ? 0 : options.acompte,
//   notifications: [...options.notifications, 'sms'],
// };
