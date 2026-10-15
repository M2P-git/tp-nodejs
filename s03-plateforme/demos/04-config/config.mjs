// Séance 3 : configuration par variables d'environnement (principe « 12-factor »).
//   1. Copiez .env.example en .env et modifiez les valeurs
//   2. npm run demo:config
//      (équivaut à : node --env-file-if-exists=demos/04-config/.env demos/04-config/config.mjs)
//
// Règles :
//   - le code ne contient AUCUN secret ; .env n'est JAMAIS commité (il est dans .gitignore) ;
//   - .env.example (sans vraies valeurs) est commité pour documenter les variables attendues ;
//   - on valide la configuration AU DÉMARRAGE : mieux vaut planter tout de suite
//     qu'à 3 h du matin lors du premier paiement.

function lireConfig(env) {
  const manquantes = ['PORT', 'DATABASE_URL', 'STRIPE_SECRET_KEY'].filter((nom) => !env[nom]);
  if (manquantes.length > 0) {
    throw new Error(`Variables d'environnement manquantes : ${manquantes.join(', ')}`);
  }
  const port = Number(env.PORT);
  if (!Number.isInteger(port) || port <= 0) throw new Error(`PORT invalide : ${env.PORT}`);

  return Object.freeze({
    port,
    environnement: env.NODE_ENV ?? 'development',
    baseDeDonnees: env.DATABASE_URL,
    stripe: { cleSecrete: env.STRIPE_SECRET_KEY },
  });
}

try {
  const config = lireConfig(process.env);
  // On n'affiche JAMAIS un secret en clair, même dans les journaux
  console.log({ ...config, stripe: { cleSecrete: `${config.stripe.cleSecrete.slice(0, 7)}…` } });
} catch (e) {
  console.error('Configuration invalide :', e.message);
  process.exitCode = 1;
}
