// Séance 2 : ne jamais attendre indéfiniment un service externe.
// fetch est intégré à Node ; AbortSignal.timeout() annule la requête au-delà d'un délai.
// (Nécessite un accès Internet ; httpbin.org renvoie la réponse après 3 secondes.)
try {
  const reponse = await fetch('https://httpbin.org/delay/3', {
    signal: AbortSignal.timeout(1000), // on abandonne au bout d'1 seconde
  });
  console.log('Statut :', reponse.status);
} catch (e) {
  // e.name vaut 'TimeoutError' quand le délai est dépassé
  console.log(`Appel abandonné (${e.name}) : on peut réessayer, ou dégrader le service.`);
}
