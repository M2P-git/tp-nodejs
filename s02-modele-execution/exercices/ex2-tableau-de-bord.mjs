// Exercice 2 : paralléliser les attentes (CORRECTION)
//
// Seule la dépendance profil → recommandations est réelle. On lance donc TOUT de suite
// les trois appels indépendants, et les recommandations dès que le profil est connu :
//
//   0 ms ──── profil ────► 100 ms ──── recommandations ────► 200 ms
//   0 ms ──── reservations ────► 100 ms
//   0 ms ──── statistiques ────► 100 ms
//
// Durée totale ≈ 200 ms au lieu de 400 ms.
//
// Rappel : une promesse démarre son travail dès sa CRÉATION. « await » ne lance rien,
// il attend. Pour paralléliser, on crée d'abord les promesses, on les attend ensuite.
//
// .catch(() => null) transforme l'échec des statistiques en valeur « null » : la promesse
// correspondante ne rejette jamais, donc Promise.all ne peut échouer qu'à cause des autres.

export async function chargerTableauDeBord(api) {
  const promesseProfil = api.profil();
  const promesseReservations = api.reservations();
  const promesseStatistiques = api.statistiques().catch(() => null);
  const promesseRecommandations = promesseProfil.then((profil) => api.recommandations(profil));

  const [profil, reservations, statistiques, recommandations] = await Promise.all([
    promesseProfil,
    promesseReservations,
    promesseStatistiques,
    promesseRecommandations,
  ]);
  return { profil, reservations, statistiques, recommandations };
}

// En production, on journaliserait l'erreur des statistiques au lieu de l'avaler en silence :
//   api.statistiques().catch((err) => { logger.warn({ err }, 'statistiques indisponibles'); return null; })
