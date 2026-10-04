# TP Node.js, Licence 3

Dépôt des travaux pratiques du module **Node.js : du modèle d'exécution à la mission
freelance**. L'enseignant y publie, **à chaque séance**, le matériel de la séance (énoncé,
démonstrations, exercices avec tests automatiques) et la **correction de la séance
précédente**.

| Dossier | Séance | Contenu |
|---|---|---|
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

## 1. Prérequis (une seule fois)

1. **Node.js 24 LTS** ou plus récent : <https://nodejs.org> (vérifier : `node --version`)
2. **Git** : <https://git-scm.com> (vérifier : `git --version`)
3. **VS Code** (recommandé) : <https://code.visualstudio.com>
4. Un compte **GitHub** à votre nom : il deviendra votre vitrine de freelance.

Configurez votre identité Git (elle apparaît dans chaque commit) :

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
node --test --watch         # relance les tests à chaque sauvegarde
```

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
