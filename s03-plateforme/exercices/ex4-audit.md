# Exercice 4 : audit d'un `package.json` récupéré sur Internet

> **Contexte.** Un client Upwork vous confie un projet « presque fini » développé par un
> précédent freelance. Avant d'exécuter quoi que ce soit, vous ouvrez `ex4-package-suspect.json`.
>
> ⚠️ **N'installez pas ce fichier.** Il a été nommé `ex4-package-suspect.json` (et non
> `package.json`) justement pour que `npm install` ne puisse pas l'utiliser.

Répondez directement dans ce fichier, sous chaque question, puis commitez-le sur **votre**
branche (voir le README du dépôt).

## 1. Le script `postinstall`

Que fait-il exactement ? Quand s'exécute-t-il ? Pourquoi est-ce le problème le plus grave du
fichier ? Quelle option de npm (ou quel réglage de pnpm) permet de s'en protéger ?

_Votre réponse :_

## 2. Les noms de paquets

Une des dépendances a un nom suspect. Laquelle ? Comment s'appelle ce type d'attaque ?
Quel est le lien avec les assistants IA qui « inventent » des noms de paquets ?

_Votre réponse :_

## 3. Les versions

Repérez les versions `*` et `latest`. Pourquoi sont-elles dangereuses, même pour des paquets
légitimes ? Racontez en deux phrases ce qui est arrivé au paquet `colors` en janvier 2022.
Quel fichier, absent ici, aurait limité les dégâts ?

_Votre réponse :_

## 4. Les paquets obsolètes ou vulnérables

Pour `request`, `moment` et `jsonwebtoken@8.5.1` : que disent leurs pages npm et la commande
`npm view <paquet>` (essayez-la : elle ne télécharge rien) ? Que proposeriez-vous à la place ?

_Votre réponse :_

## 5. Les dépendances inutiles

Quels paquets peuvent être remplacés par une fonctionnalité **intégrée** à Node 24 ou au
langage (indice : `--watch`, `--env-file`, `String.prototype.padStart`) ?
Lequel est mal rangé (dependencies au lieu de devDependencies) ?

_Votre réponse :_

## 6. Votre `package.json` corrigé

Proposez une version saine de ce fichier (en supposant que le projet utilise Express et
des jetons JWT), et la liste des commandes que vous exécuteriez pour l'installer en sécurité.

```json

```

## 7. Pour aller plus loin

Quelle grille de 6 critères utiliserez-vous désormais avant d'ajouter **n'importe quelle**
dépendance à un projet client ?

_Votre réponse :_
