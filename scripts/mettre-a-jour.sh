#!/usr/bin/env bash
# Met à jour votre copie du dépôt des TP avec la dernière version publiée par l'enseignant.
#   1. Télécharge la dernière version (git fetch).
#   2. Si vous avez des modifications (ou des commits sur main), les SAUVEGARDE sur une
#      nouvelle branche « sauvegarde/AAAAMMJJ-HHMMSS ».
#   3. Remplace votre branche main par celle de l'enseignant (origin/main).
# Les dossiers node_modules et les fichiers .env ne sont jamais touchés.
#
# Usage :  ./scripts/mettre-a-jour.sh
set -euo pipefail

racine=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "Lancez ce script depuis le dossier du dépôt tp-nodejs." >&2; exit 1; }
cd "$racine"

dossier_git=$(git rev-parse --git-dir)
if [ -f "$dossier_git/MERGE_HEAD" ] || [ -d "$dossier_git/rebase-merge" ] || [ -d "$dossier_git/rebase-apply" ]; then
  echo "Une fusion (merge) ou un rebase est en cours. Terminez-le ou annulez-le (git merge --abort) avant de mettre à jour." >&2
  exit 1
fi

echo "1/3  Téléchargement de la dernière version publiée…"
git fetch origin --tags --force --prune

branche_courante=$(git rev-parse --abbrev-ref HEAD)
modifications=$(git status --porcelain)
commits_locaux_sur_main=0
if git rev-parse --verify --quiet refs/heads/main >/dev/null && git rev-parse --verify --quiet refs/remotes/origin/main >/dev/null; then
  commits_locaux_sur_main=$(git rev-list --count origin/main..main)
fi

if [ -n "$modifications" ] || { [ "$branche_courante" = "main" ] && [ "$commits_locaux_sur_main" -gt 0 ]; }; then
  sauvegarde="sauvegarde/$(date +%Y%m%d-%H%M%S)"
  echo "2/3  Modifications détectées : sauvegarde sur la branche « $sauvegarde »…"
  git switch -c "$sauvegarde"
  if [ -n "$modifications" ]; then
    git add -A
    if [ -n "$(git config user.email || true)" ]; then
      git commit -m "Sauvegarde automatique avant mise à jour"
    else
      echo "     (identité Git non configurée : voir le README, section 1)"
      git -c user.name="Etudiant" -c user.email="etudiant@exemple.invalid" commit -m "Sauvegarde automatique avant mise à jour"
    fi
  fi
  echo "     Votre travail est en sécurité sur « $sauvegarde »."
elif [ "$branche_courante" != "main" ]; then
  echo "2/3  Rien à sauvegarder : vos commits restent sur la branche « $branche_courante »."
else
  echo "2/3  Aucune modification locale : rien à sauvegarder."
fi

echo "3/3  Remplacement de main par la version de l'enseignant…"
git switch main
git reset --hard origin/main
git clean -fd

etiquette=$(git describe --tags --abbrev=0 2>/dev/null || echo "(aucune étiquette)")
echo
echo "À jour : main = origin/main, dernière publication : $etiquette"
echo "Vos branches :"
git branch --list
