// Exercice 3 (typage dynamique) : normaliser les paramètres d'une requête (CORRECTION)
//
// Points clés :
//  - Number('') vaut 0, Number(' 3') vaut 3, parseInt('3abc') vaut 3 : aucune de ces
//    conversions n'est assez stricte. On valide d'abord le FORMAT (expression régulière),
//    puis on convertit.
//  - new Date('2026-02-30') donne silencieusement le 2 mars : on reconstruit la date
//    et on vérifie que l'année, le mois et le jour n'ont pas « glissé ».
//  - On accumule les erreurs pour toutes les renvoyer d'un coup (meilleure expérience
//    pour le développeur front qui consomme l'API).
// En séance 5, une bibliothèque de validation (Zod) fera ce travail de façon déclarative.
import { ErreurValidation } from './erreurs.mjs';

const DUREES_AUTORISEES = [15, 30, 45, 60];

const versEntier = (valeur) => (typeof valeur === 'string' && /^\d+$/.test(valeur) ? Number(valeur) : NaN);

function estDateCalendaire(texte) {
  if (typeof texte !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(texte)) return false;
  const [annee, mois, jour] = texte.split('-').map(Number);
  const d = new Date(Date.UTC(annee, mois - 1, jour));
  return d.getUTCFullYear() === annee && d.getUTCMonth() === mois - 1 && d.getUTCDate() === jour;
}

export function normaliserRecherche(query) {
  const erreurs = [];

  if (!estDateCalendaire(query.date)) erreurs.push('date');

  const duree = query.duree === undefined ? 30 : versEntier(query.duree);
  if (!DUREES_AUTORISEES.includes(duree)) erreurs.push('duree');

  const places = query.places === undefined ? 1 : versEntier(query.places);
  if (!(places >= 1 && places <= 5)) erreurs.push('places'); // NaN échoue aux deux comparaisons

  if (erreurs.length > 0) throw new ErreurValidation(erreurs);
  return { date: query.date, duree, places };
}
