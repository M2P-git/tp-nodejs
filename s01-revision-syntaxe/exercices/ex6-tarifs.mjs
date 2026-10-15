// Correction de l'exercice 6 (modules ES : export nommé et export par défaut)

export const TVA = 0.2;

export function prixTTC(prixHT) {
  return Math.round(prixHT * (1 + TVA));
}

// un fichier peut avoir plusieurs exports nommés, mais UN SEUL export par défaut
export default prixTTC;
