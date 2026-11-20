// Démonstration du cours : aucune connexion réseau, aucune lecture de secrets.
const { writeFileSync } = require('node:fs');
const { join } = require('node:path');

if (!process.env.INIT_CWD) throw new Error('Installer ce paquet avec npm dans un dossier de test.');
// Ne pas écraser un fichier qui existait avant l'atelier.
writeFileSync(join(process.env.INIT_CWD, 'preuve.txt'), 'postinstall exécuté\n', { flag: 'wx' });
console.log('joli-logger : postinstall exécuté');
