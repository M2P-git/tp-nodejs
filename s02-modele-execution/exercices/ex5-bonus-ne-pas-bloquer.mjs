// Exercice 5 (bonus) : découper un calcul pour ne pas bloquer la boucle (CORRECTION)
//
// Entre deux morceaux, on attend un setImmediate : la boucle d'événements fait un tour
// complet (timers, poll, check) avant de reprendre le calcul. Les autres clients sont servis.
//
// « await Promise.resolve() » ne suffit PAS : la suite s'exécuterait dans la file des
// microtâches, qui est vidée entièrement AVANT que la boucle passe à la phase suivante.
// On ne rendrait jamais la main aux minuteurs ni aux E/S.
//
// Limites de cette technique : le calcul total est un peu plus long, et il occupe toujours
// le même thread. Pour un vrai calcul lourd, on préfère worker_threads
// (demos/07-worker-threads.mjs) ou une file de tâches traitée par un autre processus (S9).

export function estPremier(k) {
  if (k < 2) return false;
  for (let d = 2; d * d <= k; d++) if (k % d === 0) return false;
  return true;
}

export function compterPremiers(n) {
  let total = 0;
  for (let k = 2; k < n; k++) if (estPremier(k)) total++;
  return total;
}

const rendreLaMain = () => new Promise((resoudre) => setImmediate(resoudre));

export async function compterPremiersSansBloquer(n, tailleMorceau = 50_000) {
  let total = 0;
  for (let debut = 2; debut < n; debut += tailleMorceau) {
    const fin = Math.min(debut + tailleMorceau, n);
    for (let k = debut; k < fin; k++) if (estPremier(k)) total++;
    await rendreLaMain();
  }
  return total;
}
