# Séance 3 : Node.js comme plateforme (modules, paquets, outillage, premier serveur)

> Écrire du code n'est qu'une partie du travail. Un client paie aussi pour un projet
> **reproductible** (il s'installe pareil partout), **sûr** (ses dépendances ne le
> trahissent pas) et **outillé** (on peut le tester, le lancer, le déboguer).

## Objectifs

- Choisir entre CommonJS et modules ES, et savoir lire les deux.
- Comprendre `package.json`, les versions sémantiques, le fichier de verrouillage,
  `npm ci`. Faire le parallèle avec `uv` en Python.
- Évaluer une dépendance avant de l'ajouter ; reconnaître une attaque de la chaîne
  d'approvisionnement.
- Utiliser les outils intégrés de Node 24 : `--watch`, `--env-file`, `--test`, `--inspect`.
- Écrire un serveur HTTP sans framework, puis comprendre ce qu'Express apporte.

## Préparation

```bash
.\scripts\mettre-a-jour.ps1      # ou ./scripts/mettre-a-jour.sh
cd s03-plateforme
npm ci                           # installe EXACTEMENT les versions du package-lock.json
```

## Partie 1 : démonstrations

| Démo | Sujet | Commande |
|---|---|---|
| `demos/01-serveur-http-brut.mjs` | Serveur avec `node:http` seul | `npm run demo:http` |
| `demos/02-serveur-express.mjs` | Le même avec Express 5 | `npm run demo:express` |
| `demos/03-modules/` | CommonJS, ESM, `require(esm)`, `import.meta` | `node demos/03-modules/ancien.cjs` · `moderne.mjs` · `require-esm.cjs` |
| `demos/04-config/` | Configuration par variables d'environnement | `npm run demo:config` (avant puis après avoir créé `.env`) |

Tester le serveur sous Windows : utilisez `curl.exe` (et non `curl`, qui est un alias
PowerShell d'une autre commande), ou l'extension VS Code *REST Client*, ou Bruno.

Déboguer : `node --inspect-brk demos/01-serveur-http-brut.mjs`, puis ouvrez
`chrome://inspect` dans Chrome (ou utilisez le débogueur de VS Code : F5).

## Partie 2 : exercices

```bash
node --test
```

### Exercice 1 : initialiser un projet professionnel

Dans `exercices/`, créez le dossier `ex1-mon-projet/` et faites-en un projet Node.js
« comme chez un client » : le test `ex1-verifier-projet.test.mjs` vérifie votre travail.

```bash
cd exercices
mkdir ex1-mon-projet
cd ex1-mon-projet
npm init -y
npm install express
```

Puis, **sans aide extérieure au départ** (les messages des tests vous guident) :
`"type": "module"`, `"private": true`, `engines`, scripts `start` / `dev` / `test`,
`.gitignore`, `.env.example`, `src/index.js`, `README.md`.

Variante : refaites l'exercice avec **pnpm** (`pnpm init`, `pnpm add express`) et
comparez le dossier `node_modules` et le fichier de verrouillage.

### Exercices 2 et 3 : la même API, deux fois

Le contrat de l'API et les règles métier sont fournis (`domaine.mjs`, `contrat-api.mjs`).
La **même** suite de tests vérifie les deux versions.

| Exercice | Fichier | Contrainte |
|---|---|---|
| 2 | `exercices/ex2-api-http.mjs` | `node:http` uniquement : lire le corps (un stream), limiter sa taille, router, répondre |
| 3 | `exercices/ex3-api-express.mjs` | Express 5 : le même comportement, en beaucoup moins de lignes |

Questions à traiter dans votre compte rendu (sous forme de commentaires dans `ex3`) :
combien de lignes économisées ? qu'est-ce qu'Express fait à votre place ? qu'est-ce qui
n'a pas changé ?

### Exercice 4 : audit de sécurité d'un `package.json`

Répondez dans `exercices/ex4-audit.md`, à propos de `exercices/ex4-package-suspect.json`.
⚠️ **N'installez jamais ce fichier.**

## Fin de séance

```bash
git switch -c travail/s03
git add -A
git commit -m "S03 : mes exercices"
git push -u perso travail/s03
```

## Pour la séance 4

- Créer un compte Upwork **freelance** (même incomplet) et parcourir 20 annonces
  « Node.js ». Classez-les par type de besoin (API, intégration, bot, IA, temps réel…).
- Lire `s04-cahier-des-charges/01-offre-upwork.md` dès sa publication.
