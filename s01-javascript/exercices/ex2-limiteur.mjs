// Exercice 2 (closures) : un limiteur de requêtes (CORRECTION)
//
// La Map « compteurs » est créée à chaque appel de creerLimiteur : chaque limiteur a donc
// SON état, invisible de l'extérieur. La fonction retournée « se souvient » de cette Map.
// C'est le principe de tous les middlewares configurables (express-rate-limit, cors, etc.).
//
// Algorithme : « fenêtre fixe ». Limite connue : un client peut faire 2 × max appels
// à cheval sur deux fenêtres. Les vraies bibliothèques utilisent souvent une fenêtre glissante
// et un stockage partagé (Redis) quand il y a plusieurs instances du serveur (à discuter en S7).
//
// Autre limite : les clés ne sont jamais supprimées (fuite mémoire si des millions d'IP passent).
// Amélioration possible : purger périodiquement les entrées expirées.

export function creerLimiteur(max, fenetreMs, maintenant = () => Date.now()) {
  const compteurs = new Map(); // cle -> { debut, nombre }

  return function autoriser(cle) {
    const t = maintenant();
    const compteur = compteurs.get(cle);

    if (!compteur || t - compteur.debut >= fenetreMs) {
      compteurs.set(cle, { debut: t, nombre: 1 });
      return true;
    }
    if (compteur.nombre < max) {
      compteur.nombre++;
      return true;
    }
    return false;
  };
}
