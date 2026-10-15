// Exercice 1 : vérification automatique du projet que VOUS avez créé dans exercices/ex1-mon-projet/
// (consignes détaillées dans le README de la séance)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dossier = join(import.meta.dirname, 'ex1-mon-projet');
const fichier = (nom) => join(dossier, nom);
const lirePackage = () => {
  assert.ok(existsSync(fichier('package.json')), 'exercices/ex1-mon-projet/package.json introuvable (npm init)');
  return JSON.parse(readFileSync(fichier('package.json'), 'utf8'));
};

test('package.json : modules ES et version de Node déclarée', () => {
  const pkg = lirePackage();
  assert.equal(pkg.type, 'module', '"type": "module" attendu');
  assert.match(pkg.engines?.node ?? '', /24/, '"engines": { "node": ">=24" } attendu');
  assert.equal(pkg.private, true, '"private": true évite de publier le projet sur npm par erreur');
});

test('package.json : scripts start, dev et test', () => {
  const { scripts = {} } = lirePackage();
  assert.match(scripts.start ?? '', /^node /, 'script start : « node src/index.js »');
  assert.match(scripts.dev ?? '', /--watch/, 'script dev : utiliser node --watch');
  assert.match(scripts.dev ?? '', /--env-file/, 'script dev : charger le .env avec --env-file');
  assert.match(scripts.test ?? '', /--test/, 'script test : utiliser node --test');
});

test('dépendances : express en production, pas de nodemon, pas de version flottante', () => {
  const pkg = lirePackage();
  const toutes = { ...pkg.dependencies, ...pkg.devDependencies };
  assert.ok(pkg.dependencies?.express, 'express doit être dans "dependencies"');
  assert.ok(!pkg.devDependencies?.express, 'express ne doit pas être en devDependencies');
  assert.ok(!toutes.nodemon, 'inutile : node --watch remplace nodemon');
  for (const [nom, version] of Object.entries(toutes)) {
    assert.ok(!['*', 'latest', ''].includes(version), `${nom} : version « ${version} » non reproductible`);
  }
});

test('un fichier de verrouillage est présent (npm ou pnpm)', () => {
  assert.ok(
    existsSync(fichier('package-lock.json')) || existsSync(fichier('pnpm-lock.yaml')),
    'package-lock.json ou pnpm-lock.yaml attendu : il doit être commité',
  );
});

test('.gitignore et .env.example', () => {
  assert.ok(existsSync(fichier('.gitignore')), '.gitignore attendu');
  const ignores = readFileSync(fichier('.gitignore'), 'utf8').split(/\r?\n/).map((l) => l.trim());
  assert.ok(ignores.some((l) => /^\/?node_modules\/?$/.test(l)), 'node_modules doit être ignoré');
  assert.ok(ignores.includes('.env'), '.env doit être ignoré');
  assert.ok(existsSync(fichier('.env.example')), '.env.example attendu (documente les variables)');
  assert.match(readFileSync(fichier('.env.example'), 'utf8'), /^PORT=/m, 'PORT doit figurer dans .env.example');
});

test('src/index.js lit le port dans les variables d’environnement', () => {
  assert.ok(existsSync(fichier('src/index.js')), 'src/index.js attendu');
  assert.match(readFileSync(fichier('src/index.js'), 'utf8'), /process\.env\.PORT/);
});

test('un README explique comment lancer le projet', () => {
  assert.ok(existsSync(fichier('README.md')), 'README.md attendu');
  assert.match(readFileSync(fichier('README.md'), 'utf8'), /npm (run dev|install|ci)/);
});
