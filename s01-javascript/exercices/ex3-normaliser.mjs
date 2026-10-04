// Exercice 3 (typage dynamique) : normaliser les paramètres d'une requête
//
// L'URL  /creneaux?date=2026-10-10&duree=30&places=2  arrive côté serveur sous la forme
// { date: '2026-10-10', duree: '30', places: '2' } : TOUT est chaîne de caractères.
//
// normaliserRecherche(query) doit retourner { date, duree, places } correctement typés :
//   - date   : obligatoire, chaîne au format AAAA-MM-JJ ET date réelle du calendrier
//              (attention : new Date('2026-02-30') ne lève aucune erreur…)
//   - duree  : facultative (30 par défaut) ; nombre entier parmi 15, 30, 45, 60
//   - places : facultative (1 par défaut) ; nombre entier de 1 à 5
// Une chaîne vide, '2.5', ' 3', '3abc' ou 'abc' sont invalides.
//
// Si un ou plusieurs champs sont invalides : lever une ErreurValidation (voir erreurs.mjs)
// contenant la liste de TOUS les champs fautifs, dans l'ordre date, duree, places.
//
// Vérification (depuis le dossier de la séance) :  node --test
import { ErreurValidation } from './erreurs.mjs';

export function normaliserRecherche(query) {
  // TODO
  throw new Error('À implémenter');
}
