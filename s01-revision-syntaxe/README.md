# Séance 1 : révision de la syntaxe JavaScript

> Avant de comprendre **pourquoi** Node.js se comporte ainsi, il faut **lire et écrire** du
> JavaScript sans hésiter. Ces huit exercices révisent la syntaxe utile pour la suite du cours,
> avec des tests automatiques. Ils complètent les exercices de la séance
> (`../s01-javascript/`) : faites-les **avant**, ou en cas de blocage.

## Objectifs

À la fin, vous savez écrire sans aide :

- une chaîne avec un **template literal** et la transformer (`split`, `join`, `trim`) ;
- une fonction avec **paramètre par défaut**, **rest** et **closure** ;
- les opérations sur tableaux : `map`, `filter`, `reduce`, `find`, `sort` ;
- copier ou modifier un objet sans le muter (**spread**, **destructuring**) ;
- des conditions modernes : `?.`, `??`, ternaire ;
- les **exports** nommés et par défaut d'un module ES ;
- une fonction **asynchrone** (`async` / `await`) et un `try` / `catch` ;
- repérer et corriger trois bugs classiques de JavaScript.

## Contenu du dossier

```text
s01-revision-syntaxe/
└── exercices/     8 exercices + leurs tests automatiques (*.test.mjs)
```

| Exercice | Fichier à modifier | Type | Notion |
|---|---|---|---|
| 1 | `ex1-chaines.mjs` | écrire | chaînes, template literals |
| 2 | `ex2-fonctions.mjs` | écrire | paramètres par défaut, rest, closure |
| 3 | `ex3-tableaux.mjs` | écrire | `map`, `filter`, `reduce`, `find`, `sort` |
| 4 | `ex4-objets.mjs` | écrire | spread, destructuring, immutabilité |
| 5 | `ex5-conditions.mjs` | écrire | `?.`, `??`, ternaire |
| 6 | `ex6-tarifs.mjs` | compléter | `export` nommé et par défaut |
| 7 | `ex7-asynchrone.mjs` | écrire | promesses, `async` / `await`, `try` / `catch` |
| 8 | `ex8-corriger.mjs` | corriger | trois bugs à trouver |

## Comment travailler

Chaque fichier d'exercice commence par un **énoncé en commentaire**, avec un rappel de
syntaxe. Lisez-le, écrivez le code, puis vérifiez :

```bash
cd s01-revision-syntaxe
node --test                 # lance tous les tests
node --test --watch         # relance à chaque sauvegarde (Ctrl+C pour quitter)
```

Au départ : **aucun test ne passe**. Objectif : **43 sur 43**.
Avec Docker, `--watch` ne voit pas toujours vos sauvegardes : relancez `node --test` à la main.

Règles :

- ne modifiez **pas** les fichiers `*.test.mjs` ;
- exercice 8 : pour chaque bug, écrivez en commentaire **une phrase** qui explique la cause ;
- vous pouvez utiliser un assistant IA pour **comprendre** un message d'erreur, pas pour
  écrire la solution : on vous demandera d'expliquer votre code.

## Les corrigés

La correction est publiée à la séance suivante, avec celle des exercices de la séance. Les
questions et les corrigés **commentés** de la révision sont aussi dans les diapositives de la
séance 1 (section « Révision »).
