# Séance 1 : l'essentiel de JavaScript pour comprendre Node.js

> On ne vient pas apprendre une syntaxe : on vient comprendre **les dix idées** du
> langage sans lesquelles Node.js reste une boîte noire. Chaque démonstration illustre
> un bug réel que l'on rencontre dans des projets clients.

## Objectifs

À la fin de la séance, vous savez **expliquer** (et pas seulement réciter) :

- pourquoi un objet modifié « à un endroit » change « partout » (références) ;
- ce qu'est une closure, et pourquoi tout middleware Express en est une ;
- pourquoi `this` « se perd » quand on passe une méthode en callback ;
- pourquoi toute donnée venant du réseau doit être validée et convertie ;
- comment un module est chargé une seule fois (et ce que cela implique) ;
- comment les erreurs circulent (synchrones, callbacks, promesses).

## Contenu du dossier

```text
s01-javascript/
├── demos/          9 programmes courts : « prédire avant d'exécuter »
└── exercices/      4 exercices + leurs tests automatiques (*.test.mjs)
```

## Partie 0 : récupérer le dépôt (15 min)

Suivez les sections 1 et 2 du [README principal](../README.md) : installation de
Node 24 et de Git, configuration de votre identité, `git clone`.

Vérification :

```bash
node --version   # v24.x ou plus
git --version
```

## Partie 1 : prédire avant d'exécuter (60 min)

Pour **chaque** démonstration :

1. lisez le code et **écrivez sur papier** ce que vous pensez voir s'afficher ;
2. exécutez : `node demos/<fichier>` ;
3. si vous vous êtes trompé, **expliquez pourquoi** en une phrase. C'est cette phrase qui compte.

| Démo | Idée | La question à se poser |
|---|---|---|
| `01-valeurs-et-references.mjs` | Références | Pourquoi Marc ne paie-t-il plus d'acompte ? |
| `02-closures.mjs` | Closures | Pourquoi `var` affiche-t-il trois fois 4 ? |
| `03-this.mjs` | `this` | Pourquoi `this` vaut-il `undefined` ? |
| `04-coercition.mjs` | Typage dynamique | Combien font `'2' + 1` et `'15' * 2` ? Pourquoi ? |
| `05-json.mjs` | JSON | Que deviennent une `Date`, un `Set`, `undefined` et une fonction ? |
| `06-module-singleton/main.mjs` | Modules | Combien de fois le module est-il chargé ? |
| `07-fonctions-valeurs.mjs` | Fonctions | Pourquoi « plus tard » s'affiche-t-il après « maintenant » ? |
| `08-classes-et-evenements.mjs` | Prototypes, événements | Qui connaît qui entre l'agenda et les abonnés ? |
| `09-erreurs.mjs` | Erreurs | Quelles sont les trois façons de recevoir une erreur ? |

## Partie 2 : exercices (75 min)

Les tests sont fournis. **Ils échouent au départ** : votre travail est de les faire passer.

```bash
cd s01-javascript
node --test              # lance tous les tests de la séance
node --test --watch      # relance à chaque sauvegarde (Ctrl+C pour quitter)
```

| Exercice | Fichier à modifier | Notion |
|---|---|---|
| 1 | `exercices/ex1-options-partagees.mjs` | Ne jamais muter une donnée partagée |
| 2 | `exercices/ex2-limiteur.mjs` | Closure : un limiteur de requêtes anti-abus |
| 3 | `exercices/ex3-normaliser.mjs` | Valider et convertir les paramètres d'une URL |
| 4 | `exercices/ex4-agenda.mjs` | Classe, `EventEmitter`, champs privés |

Règles :

- ne modifiez **pas** les fichiers `*.test.mjs` ni `erreurs.mjs` ;
- vous pouvez utiliser un assistant IA pour **comprendre** une notion ou un message
  d'erreur, pas pour écrire la solution à votre place. À la séance suivante, on vous
  demandera d'expliquer votre code à l'oral.

## Partie 3 : sauvegarder votre travail (10 min)

La correction sera publiée à la séance 2 et **écrasera** les fichiers d'exercices.
Pour conserver votre version, rangez-la sur votre branche :

```bash
git switch -c travail/s01
git add -A
git commit -m "S01 : mes exercices"
```

Puis, une fois votre dépôt personnel créé sur GitHub (README principal, section 6) :

```bash
git remote add perso https://github.com/<votre-pseudo>/tp-nodejs-<votre-pseudo>.git
git push -u perso travail/s01
```

## Pour la séance 2

- Terminer les exercices (les quatre fichiers de tests au vert).
- Lire 5 annonces Upwork contenant « Node.js » et noter, pour chacune, ce que le client
  veut **vraiment** obtenir (pas la technologie : le résultat).
