# Exercice 4 : audit d'un `package.json` récupéré sur Internet (CORRECTION)

> ⚠️ **N'installez pas `ex4-package-suspect.json`.** L'adresse `203.0.113.7` appartient à
> une plage réservée à la documentation (RFC 5737) : elle ne mène nulle part, mais le
> *mécanisme* est exactement celui des vraies attaques.

## 1. Le script `postinstall`

`postinstall` s'exécute **automatiquement** à la fin de `npm install`, avec les droits de
l'utilisateur qui installe. Ici, il télécharge un script shell depuis un serveur inconnu
et l'exécute (`curl … | sh`). Ce script peut tout faire : lire `~/.ssh`, les fichiers `.env`,
les jetons npm ou GitHub, installer une porte dérobée… **avant même qu'on ait lu une ligne
du projet**.

C'est le problème le plus grave, car il se déclenche au tout premier geste du développeur.

Protections :

- `npm install --ignore-scripts` (ou `npm config set ignore-scripts true` au niveau global,
  puis on autorise au cas par cas) ;
- **pnpm** (v10 et plus) n'exécute plus les scripts d'installation des dépendances par défaut :
  il faut les autoriser explicitement (`pnpm approve-builds`). Attention : ceci concerne les
  scripts des **dépendances**. Un `postinstall` écrit dans le `package.json` du projet
  lui-même s'exécute quand même. C'est un argument de plus pour **lire** le fichier avant de
  lancer quoi que ce soit ;
- travailler sur un projet inconnu dans un conteneur (Docker, Dev Container) plutôt que
  directement sur sa machine.

## 2. Les noms de paquets

`expresss` (trois « s ») n'est pas `express`. C'est du **typosquatting** : un attaquant
publie un paquet dont le nom ressemble à un paquet populaire et attend les fautes de frappe.
Vérification : `npm view expresss` montre un paquet sans rapport, publié par un inconnu.

Lien avec l'IA : les assistants de code **inventent** parfois des noms de paquets plausibles
(« hallucinations »). Des attaquants repèrent ces noms et les publient avec du code
malveillant : on parle de *slopsquatting*. **Règle : on ne copie jamais un
`npm install <nom>` proposé par une IA sans avoir vérifié le paquet sur npmjs.com.**

## 3. Les versions

- `"*"` accepte **n'importe quelle** version, y compris une future version majeure
  incompatible.
- `"latest"` installe la dernière version publiée au moment de l'installation : deux
  développeurs (ou le serveur de production) peuvent obtenir des codes différents.

Le cas `colors` (janvier 2022) : son propre mainteneur a publié une version sabotée qui
affichait du texte incohérent en boucle infinie (« protestware »). Tous les projets qui
acceptaient automatiquement la dernière version ont été cassés du jour au lendemain.
npm a ensuite retiré ces versions.

Ce qui manque : un **fichier de verrouillage** (`package-lock.json` ou `pnpm-lock.yaml`),
commité, et une installation en CI avec `npm ci` (qui respecte strictement le verrou).

## 4. Les paquets obsolètes ou vulnérables

| Paquet | Constat | Remplacement |
|---|---|---|
| `request` | **Déprécié** depuis 2020 (`npm view request deprecated`). | `fetch`, intégré à Node ; ou `undici`, `ky` |
| `moment` | Pas déprécié sur npm, mais **en maintenance** : ses auteurs déconseillent de l'utiliser dans un nouveau projet. Il est lourd et ses objets sont mutables. | `date-fns`, `Luxon`, `Day.js` ; à terme l'API standard `Temporal` |
| `jsonwebtoken@8.5.1` | `npm audit` signale **3 vulnérabilités de sévérité élevée** (dont un contournement de la vérification de signature). | `jsonwebtoken@^9` ou `jose` |

## 5. Les dépendances inutiles

- `nodemon` → `node --watch` (intégré). En plus, il est rangé dans `dependencies` : il serait
  installé en **production**, où il ne sert à rien. Un outil de développement va dans
  `devDependencies`.
- `dotenv` → `node --env-file=.env` ou `process.loadEnvFile()` (intégrés).
- `left-pad` → `String.prototype.padStart()` (le paquet lui-même affiche cette
  dépréciation). C'est le paquet de l'incident de 2016 : son retrait de npm avait cassé
  des milliers de projets.
- `colors` → pour un serveur, les journaux sont en JSON et n'ont pas besoin de couleur.
  En CLI, `util.styleText()` est intégré à Node.
- `lodash` → la plupart des fonctions ont un équivalent natif (`structuredClone`,
  `Array.prototype.flat`, `Object.groupBy`…). À ne garder que si l'on utilise vraiment
  une fonction précise.

## 6. Votre `package.json` corrigé

```json
{
  "name": "projet-client",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=24" },
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch --env-file=.env src/index.js",
    "test": "node --test"
  },
  "dependencies": {
    "express": "^5.2.1",
    "jose": "^6.0.0"
  }
}
```

Installation prudente :

```bash
# 1. Lire package.json AVANT tout (scripts, noms, versions)
# 2. Installer sans exécuter les scripts, puis auditer
npm install --ignore-scripts
npm audit
npm ls --all          # voir l'arbre complet des dépendances
# 3. Commiter le package-lock.json ; en CI et en production :
npm ci --ignore-scripts
```

## 7. Grille avant d'ajouter une dépendance

1. **En ai-je besoin ?** Node ou le langage le font-ils déjà ? Dix lignes de code
   suffiraient-elles ?
2. **Le nom est-il exact ?** Vérifié sur npmjs.com, éditeur connu, lien vers le dépôt GitHub.
3. **Est-il maintenu ?** Date de la dernière version, issues traitées, nombre de mainteneurs.
4. **Est-il utilisé ?** Téléchargements hebdomadaires, projets connus qui en dépendent.
5. **Que coûte-t-il ?** Nombre de dépendances transitives, taille, scripts d'installation.
6. **Est-il sûr et compatible ?** `npm audit`, avis de sécurité, licence compatible avec
   le contrat client (MIT, Apache-2.0, ISC… et attention aux licences GPL et AGPL).
