// Exercice 1 : valeurs et références
// Cette fonction contient le bug de la démo 01 : elle MODIFIE un objet partagé.
// Corrigez-la pour que :
//   - OPTIONS_PAR_DEFAUT ne soit jamais modifié ;
//   - l'objet « options » passé par l'appelant ne soit jamais modifié ;
//   - le résultat visible reste le même (acompte à 0 pour un VIP, ajout de la notification 'sms').
// Vérification (depuis le dossier de la séance) :  node --test

export const OPTIONS_PAR_DEFAUT = { devise: 'EUR', acompte: 0.3, notifications: ['email'] };

export function creerReservation(client, options = OPTIONS_PAR_DEFAUT) {
  if (client.vip) options.acompte = 0;
  options.notifications.push('sms');
  return { client: client.nom, ...options };
}
