// Règles métier de la mini-API « créneaux » (fichier FOURNI, ne pas modifier).
//
// Remarquez que ce fichier ne sait RIEN de HTTP : pas de req, pas de res, pas de code 200.
// Les exercices 2 (node:http) et 3 (Express) réutilisent exactement le même domaine :
// seule la couche « transport » change. C'est l'idée de l'architecture en couches (S5).

export class ErreurHttp extends Error {
  constructor(status, message, champs) {
    super(message);
    this.name = 'ErreurHttp';
    this.status = status;
    if (champs) this.champs = champs;
  }
}

function genererCreneaux(ouverture, fermeture, pasMinutes) {
  const enMinutes = (hhmm) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));
  const enTexte = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const creneaux = [];
  for (let m = enMinutes(ouverture); m < enMinutes(fermeture); m += pasMinutes) creneaux.push(enTexte(m));
  return creneaux;
}

// Le salon ouvre de 9 h à 17 h, par créneaux de 30 minutes : '09:00', '09:30', … '16:30'
export const CRENEAUX_DU_JOUR = Object.freeze(genererCreneaux('09:00', '17:00', 30));

export function estDateCalendaire(texte) {
  if (typeof texte !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(texte)) return false;
  const [annee, mois, jour] = texte.split('-').map(Number);
  const d = new Date(Date.UTC(annee, mois - 1, jour));
  return d.getUTCFullYear() === annee && d.getUTCMonth() === mois - 1 && d.getUTCDate() === jour;
}

// Renvoie la liste des champs invalides (tableau vide si tout va bien)
export function validerReservation(corps) {
  if (corps === null || typeof corps !== 'object' || Array.isArray(corps)) return ['corps'];
  const champs = [];
  if (!estDateCalendaire(corps.date)) champs.push('date');
  if (!CRENEAUX_DU_JOUR.includes(corps.heure)) champs.push('heure');
  if (typeof corps.client !== 'string' || corps.client.trim() === '' || corps.client.length > 100) {
    champs.push('client');
  }
  return champs;
}

// Un « stock » de réservations en mémoire (remplacé par PostgreSQL en séance 6)
export function creerStock() {
  const reservations = new Map(); // id -> réservation
  let dernierId = 0;
  const cle = (date, heure) => `${date} ${heure}`;
  const occupes = new Set(); // 'AAAA-MM-JJ HH:MM'

  return {
    creneauxLibres(date) {
      return CRENEAUX_DU_JOUR.filter((heure) => !occupes.has(cle(date, heure)));
    },
    reserver({ date, heure, client }) {
      if (occupes.has(cle(date, heure))) {
        throw new ErreurHttp(409, `Le créneau du ${date} à ${heure} est déjà réservé`);
      }
      const reservation = { id: ++dernierId, date, heure, client: client.trim() };
      occupes.add(cle(date, heure));
      reservations.set(reservation.id, reservation);
      return { ...reservation };
    },
    trouver(id) {
      const r = reservations.get(id);
      return r ? { ...r } : null;
    },
  };
}
