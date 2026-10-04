// Ce module n'est exécuté qu'UNE SEULE FOIS, même s'il est importé partout :
// Node le met en cache. C'est pour cela qu'un module « db.js » partage une seule
// connexion (un seul pool) dans toute l'application.
console.log('→ chargement de compteur.mjs');
let valeur = 0;
export const incrementer = () => ++valeur;
