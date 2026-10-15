// Séance 2 (lire un gros fichier) : tout charger en mémoire vs « streamer ».
//   node 08-streams-memoire.mjs            (1er lancement : génère gros.log, ~200 Mo)
//   node 08-streams-memoire.mjs            (compresse en streaming)
//   node 08-streams-memoire.mjs readFile   (charge tout en mémoire)
// Comparez la mémoire (RSS) affichée dans les deux cas.
import { createReadStream, createWriteStream, existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

const FICHIER = 'gros.log';
const Mo = (o) => `${Math.round(o / 1024 / 1024)} Mo`;

if (!existsSync(FICHIER)) {
  const ligne = '2026-10-04T10:00:00Z INFO reservation créée id=123 client=456\n';
  await pipeline(
    (function* () { for (let i = 0; i < 3_300_000; i++) yield ligne; })(),
    createWriteStream(FICHIER),
  );
  console.log('gros.log généré : relancez le script pour la mesure.');
  process.exit(0);
}
console.log('Taille du fichier :', Mo((await stat(FICHIER)).size));

// 1) Approche « tout en mémoire » : simple, mais la RAM consommée suit la taille du fichier
if (process.argv[2] === 'readFile') {
  const contenu = await readFile(FICHIER);
  console.log('readFile → octets lus :', Mo(contenu.length));
  console.log('Mémoire (RSS) :', Mo(process.memoryUsage().rss));
} else {
  // 2) Approche « stream » : morceaux de 64 Kio, la mémoire reste quasi constante.
  //    pipeline() gère la contre-pression (backpressure) et la propagation des erreurs.
  await pipeline(createReadStream(FICHIER), createGzip(), createWriteStream(`${FICHIER}.gz`));
  console.log('Compression en streaming terminée →', Mo((await stat(`${FICHIER}.gz`)).size));
  console.log('Mémoire (RSS) :', Mo(process.memoryUsage().rss));
}
