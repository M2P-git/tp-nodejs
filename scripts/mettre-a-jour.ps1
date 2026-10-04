<#
.SYNOPSIS
  Met à jour votre copie du dépôt des TP avec la dernière version publiée par l'enseignant.

.DESCRIPTION
  1. Télécharge la dernière version (git fetch).
  2. Si vous avez des modifications (ou des commits sur main), les SAUVEGARDE sur une
     nouvelle branche « sauvegarde/AAAAMMJJ-HHMMSS ».
  3. Remplace votre branche main par celle de l'enseignant (origin/main).
  Les dossiers node_modules et les fichiers .env ne sont jamais touchés.

.EXAMPLE
  .\scripts\mettre-a-jour.ps1
  Si l'exécution des scripts est bloquée :
  powershell -ExecutionPolicy Bypass -File .\scripts\mettre-a-jour.ps1
#>

$ErrorActionPreference = 'Stop'

function Invoke-Git {
  # Lance git et arrête le script si la commande échoue (code de sortie non nul).
  # git écrit sa progression sur stderr : ce n'est pas une erreur, d'où le passage
  # temporaire en mode « Continue » (sinon Windows PowerShell 5.1 peut s'arrêter à tort).
  $precedente = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try { & git @args } finally { $ErrorActionPreference = $precedente }
  if ($LASTEXITCODE -ne 0) { throw "La commande « git $($args -join ' ') » a échoué." }
}

function Get-SortieGit {
  # Lance git et renvoie sa sortie, ou $null si la commande échoue (sans afficher d'erreur).
  # Nécessaire sous Windows PowerShell 5.1 : une redirection 2>$null sur une commande native
  # qui écrit sur stderr provoque sinon une erreur bloquante.
  $precedente = $ErrorActionPreference
  $ErrorActionPreference = 'SilentlyContinue'
  try { $sortie = & git @args 2>$null } finally { $ErrorActionPreference = $precedente }
  if ($LASTEXITCODE -eq 0) { return $sortie }
  return $null
}

$racine = Get-SortieGit rev-parse --show-toplevel
if (-not $racine) { throw "Lancez ce script depuis le dossier du dépôt tp-nodejs." }
Set-Location $racine

$dossierGit = (& git rev-parse --git-dir)
if ((Test-Path "$dossierGit/MERGE_HEAD") -or (Test-Path "$dossierGit/rebase-merge") -or (Test-Path "$dossierGit/rebase-apply")) {
  throw "Une fusion (merge) ou un rebase est en cours. Terminez-le ou annulez-le (git merge --abort) avant de mettre à jour."
}

Write-Host "1/3  Téléchargement de la dernière version publiée…" -ForegroundColor Cyan
Invoke-Git fetch origin --tags --force --prune

$brancheCourante = (& git rev-parse --abbrev-ref HEAD)
$modifications = (& git status --porcelain)
$commitsLocauxSurMain = 0
if ((Get-SortieGit rev-parse --verify --quiet refs/heads/main) -and (Get-SortieGit rev-parse --verify --quiet refs/remotes/origin/main)) {
  $commitsLocauxSurMain = [int](& git rev-list --count origin/main..main)
}

if ($modifications -or ($brancheCourante -eq 'main' -and $commitsLocauxSurMain -gt 0)) {
  $sauvegarde = "sauvegarde/$(Get-Date -Format 'yyyyMMdd-HHmmss')"
  Write-Host "2/3  Modifications détectées : sauvegarde sur la branche « $sauvegarde »…" -ForegroundColor Yellow
  Invoke-Git switch -c $sauvegarde
  if ($modifications) {
    Invoke-Git add -A
    $identite = Get-SortieGit config user.email
    if ($identite) {
      Invoke-Git commit -m "Sauvegarde automatique avant mise à jour"
    } else {
      Write-Host "     (identité Git non configurée : voir le README, section 1)" -ForegroundColor DarkYellow
      Invoke-Git -c user.name=Etudiant -c user.email=etudiant@exemple.invalid commit -m "Sauvegarde automatique avant mise à jour"
    }
  }
  Write-Host "     Votre travail est en sécurité sur « $sauvegarde »." -ForegroundColor Green
} elseif ($brancheCourante -ne 'main') {
  Write-Host "2/3  Rien à sauvegarder : vos commits restent sur la branche « $brancheCourante »." -ForegroundColor Green
} else {
  Write-Host "2/3  Aucune modification locale : rien à sauvegarder." -ForegroundColor Green
}

Write-Host "3/3  Remplacement de main par la version de l'enseignant…" -ForegroundColor Cyan
Invoke-Git switch main
Invoke-Git reset --hard origin/main
Invoke-Git clean -fd

$etiquette = Get-SortieGit describe --tags --abbrev=0
if (-not $etiquette) { $etiquette = '(aucune étiquette)' }
Write-Host ""
Write-Host "À jour : main = origin/main, dernière publication : $etiquette" -ForegroundColor Green
Write-Host "Vos branches :" -ForegroundColor Cyan
& git branch --list
