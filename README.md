# TP Node.js, Licence 3

Dépôt des travaux pratiques du module **Node.js : du modèle d'exécution à la mission
freelance**. L'enseignant y publie, **à chaque séance**, le matériel de la séance (énoncé,
démonstrations, exercices avec tests automatiques) et la **correction de la séance
précédente**.

| Dossier | Séance | Contenu |
|---|---|---|
| `s01-revision-syntaxe/` | 1 | Révision de la syntaxe JavaScript (8 exercices avec tests) |
| `s01-javascript/` | 1 | L'essentiel de JavaScript pour comprendre Node.js |
| `s02-modele-execution/` | 2 | Boucle d'événements, asynchronisme, pool de threads, streams |
| `s03-plateforme/` | 3 | Modules, paquets, outillage, premier serveur HTTP |
| `s04-cahier-des-charges/` | 4 | De l'annonce Upwork au cahier des charges |
| `s05-…` à `s12-…` | 5 à 12 | Projet fil rouge RDV-Hub : énoncés, version de référence, critères des jalons |

Les dossiers apparaissent au fil des séances. Chaque publication porte une **étiquette**
(*tag*) : `seance-01`, `seance-02`, etc.

À partir de la séance 5, votre binôme développe le projet RDV-Hub dans **votre propre
dépôt** GitHub : ce sera votre vitrine de freelance. Ce dépôt-ci fournit, à chaque
séance, l'énoncé et une version de référence du projet pour repartir d'un état propre
en cas de retard.

---

## 1. Installer son poste (une seule fois)

Deux chemins mènent au **même résultat** : une commande `node --version` qui répond
`v24.x`. Choisissez-en **un seul**.

| | **Chemin A : installation officielle** | **Chemin B : Docker** |
|---|---|---|
| Principe | Node.js s'installe sur votre ordinateur | Node.js vit dans une « machine » jetable (un conteneur) |
| Vous installez | Node.js, Git, VS Code | Docker, Git, VS Code |
| Avantage | Le plus simple, le plus rapide à l'usage | Rien de Node sur votre ordinateur ; même environnement pour tous ; on peut tout détruire et recommencer |
| À choisir si | Vous avez les droits d'installation | Vous ne voulez (ou ne pouvez) rien installer de Node, ou votre ordinateur est géré par un établissement |

Dans les deux cas, installez aussi **Git** et créez un compte **GitHub** à votre nom (il
deviendra votre vitrine de freelance). **VS Code** est recommandé.

### Chemin A : installation officielle

1. **Node.js 24 LTS** (ou plus récent), depuis le site officiel <https://nodejs.org>
   (bouton « LTS », puis l'installateur : `.msi` sous Windows, `.pkg` sous macOS).
   Sous Linux, ou pour pouvoir changer de version facilement, utilisez un gestionnaire de
   versions : [fnm](https://github.com/Schniz/fnm) ou [nvm](https://github.com/nvm-sh/nvm).
2. **Git** : <https://git-scm.com>
3. **VS Code** : <https://code.visualstudio.com>

Fermez puis rouvrez votre terminal, et vérifiez :

```bash
node --version    # v24.x ou plus
npm --version
git --version
```

### Chemin B : Docker (rien à installer de Node)

1. **Docker** : [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows,
   macOS) ou Docker Engine (Linux). Sous Windows, acceptez l'installation de WSL 2.
   Lancez Docker Desktop et attendez qu'il indique « Engine running ».
2. **Git** et **VS Code** (voir chemin A).
3. Récupérez le dépôt (section 2 ci-dessous), puis, **depuis la racine du dépôt** :

```bash
docker compose up -d --build   # construit puis démarre « la machine » (1re fois : 1 à 3 min)
docker compose exec node bash  # ouvre un terminal DANS la machine
```

Vous êtes maintenant dans la machine : le prompt change (`root@...:/work#`), et toutes les
commandes du cours s'y exécutent comme sur un poste normal.

```bash
node --version   # v24.x
cd s01-javascript
node --test
exit             # quitte le terminal ; la machine continue de tourner
```

| Je veux… | Commande (depuis la racine du dépôt) |
|---|---|
| Rouvrir un terminal dans la machine | `docker compose exec node bash` |
| Exécuter une seule commande | `docker compose exec node node --test` |
| Voir si la machine tourne | `docker compose ps` |
| L'éteindre (vos fichiers restent) | `docker compose down` |
| La reconstruire de zéro | `docker compose down` puis `docker compose up -d --build` |

**Comment ça marche.** Le dossier du dépôt est **partagé** entre votre ordinateur et la
machine (dossier `/work`) : vous éditez vos fichiers dans VS Code, comme d'habitude, et vous
exécutez dans la machine. Le port **3000** est relié à votre ordinateur : un serveur lancé
dans la machine répond sur <http://localhost:3000> dans votre navigateur.

**Variante tout-en-un avec VS Code.** Installez l'extension *Dev Containers*, ouvrez le
dossier du dépôt, puis `F1` → **Dev Containers: Reopen in Container**. VS Code démarre la
machine et s'y connecte : l'éditeur **et** le terminal sont dans la machine.

**À savoir avec Docker.**

- Git peut rester sur votre ordinateur (clone, commit, push) : c'est le plus simple.
- Le « mode veille » de Node (`node --test --watch`) ne voit pas toujours les fichiers
  modifiés depuis votre éditeur sous Windows et macOS. Dans ce cas, relancez simplement
  `node --test` après chaque sauvegarde.
- Un serveur lancé dans la machine doit écouter toutes les interfaces : `server.listen(3000)`
  fonctionne ; `server.listen(3000, 'localhost')` n'est **pas** joignable depuis votre navigateur.
- `npm install` est plus lent que sur une installation officielle (partage de fichiers).

### Votre identité Git (dans les deux cas)

Elle apparaît dans chaque commit :

```bash
git config --global user.name "Prénom Nom"
git config --global user.email "vous@exemple.com"
```

## 2. Récupérer le dépôt (une seule fois)

```bash
git clone https://github.com/M2P-git/tp-nodejs.git
cd tp-nodejs
```

## 3. À chaque séance : récupérer la nouvelle version

> **Règle du module.** La branche `main` de votre copie locale doit toujours être
> **identique** à celle de l'enseignant. À chaque séance, on l'écrase par la nouvelle
> version publiée. Si vous voulez **garder** votre travail, vous le rangez d'abord sur
> **votre propre branche**.

### Cas A : je n'ai rien à garder, j'écrase tout

```bash
git fetch origin              # télécharge la nouvelle version (sans rien modifier chez vous)
git switch main               # se placer sur la branche principale
git reset --hard origin/main  # ÉCRASE votre main par celle de l'enseignant
git clean -fd                 # supprime les fichiers non suivis (pas node_modules ni .env)
```

⚠️ `reset --hard` et `clean -fd` **suppriment définitivement** vos modifications non
commitées. Si vous hésitez, appliquez le cas B.

### Cas B : je garde mon travail sur ma branche, puis j'écrase

```bash
git switch -c travail/s01           # 1. crée VOTRE branche, en emportant vos modifications
git add -A                          # 2. prépare tous vos fichiers (nouveaux et modifiés)
git commit -m "S01 : mes exercices" # 3. les enregistre sur votre branche
git switch main                     # 4. revient sur main…
git fetch origin
git reset --hard origin/main        # 5. …et l'écrase par la nouvelle version
```

Votre travail est en sécurité sur `travail/s01`. Vérification : `git branch` liste vos branches.

### Le raccourci : le script de mise à jour

Le script fait le cas B **automatiquement** : s'il trouve des modifications, il les
sauvegarde sur une branche `sauvegarde/AAAAMMJJ-HHMMSS`, **puis** il écrase `main`.

```powershell
.\scripts\mettre-a-jour.ps1     # Windows (PowerShell)
```

```bash
./scripts/mettre-a-jour.sh      # macOS, Linux, Git Bash
```

Si PowerShell refuse d'exécuter le script : `powershell -ExecutionPolicy Bypass -File .\scripts\mettre-a-jour.ps1`

## 4. Avancer de votre côté, sur votre branche

Vous pouvez travailler **uniquement** sur votre branche et y intégrer chaque nouvelle séance :

```bash
git switch travail/s01        # retourner sur votre branche
git fetch origin
git merge origin/main         # intégrer la nouvelle séance (et la correction) dans VOTRE branche
```

En cas de **conflit** (vous et l'enseignant avez modifié les mêmes lignes, typiquement un
exercice corrigé), Git marque les fichiers concernés :

```text
<<<<<<< HEAD
… votre version …
=======
… la version de l'enseignant (correction) …
>>>>>>> origin/main
```

Choisissez, supprimez les marqueurs, puis `git add <fichier>` et `git commit`.
VS Code propose des boutons « Accept Current / Incoming / Both » pour faciliter ce choix.
Pour abandonner une fusion en cours : `git merge --abort`.

Autre option : démarrer une nouvelle branche par séance, à partir de la version publiée :

```bash
git switch -c travail/s02 origin/main
```

## 5. Comparer votre travail avec la correction

La correction de la séance N arrive dans `main` à la séance N + 1 et **remplace** les
fichiers de départ. Pour comparer votre version avec la correction :

```bash
git diff travail/s01 main -- s01-javascript/exercices/ex2-limiteur.mjs
```

## 6. Sauvegarder votre branche sur VOTRE GitHub

Vous ne pouvez pas pousser sur le dépôt de l'enseignant (vous n'avez que le droit de
lecture). Créez donc **votre** dépôt :

1. Sur GitHub, créez un dépôt vide, par exemple `tp-nodejs-<votre-pseudo>`
   (sans README, sans .gitignore).
2. Ajoutez-le comme second dépôt distant, nommé `perso`, puis poussez votre branche :

```bash
git remote add perso https://github.com/<votre-pseudo>/tp-nodejs-<votre-pseudo>.git
git push -u perso travail/s01
```

Ensuite, un simple `git push` suffit depuis cette branche. `git remote -v` affiche vos
deux dépôts distants : `origin` (enseignant, lecture) et `perso` (vous, lecture-écriture).

## 7. Revenir à l'état d'une séance précise

```bash
git tag                                   # liste des publications
git switch -c revoir-s02 seance-02        # nouvelle branche à l'état de la séance 2
```

## 8. Lancer les tests d'une séance

Chaque exercice est accompagné de tests automatiques (`*.test.mjs`) :

```bash
cd s01-javascript
node --test                 # tous les tests de la séance
node --test --watch         # relance les tests à chaque sauvegarde (voir la remarque Docker, section 1)
```

Avec Docker, ces commandes se tapent **dans la machine** (`docker compose exec node bash`).

Au début, les tests **échouent** : c'est normal, c'est à vous de les faire passer.

## Aide-mémoire

| Je veux… | Commande |
|---|---|
| Voir où j'en suis | `git status` |
| Voir mes branches | `git branch -a` |
| Récupérer la version de l'enseignant sans rien toucher | `git fetch origin` |
| Écraser `main` par la version de l'enseignant | `git reset --hard origin/main` |
| Ranger mon travail sur une nouvelle branche | `git switch -c travail/sNN` puis `git add -A` et `git commit -m "…"` |
| Intégrer la nouvelle séance dans ma branche | `git merge origin/main` |
| Annuler une fusion qui se passe mal | `git merge --abort` |
| Retrouver un travail « perdu » | `git reflog` (l'historique de tous vos déplacements) |
