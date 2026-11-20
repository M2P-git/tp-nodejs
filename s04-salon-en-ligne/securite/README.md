# Atelier sécurité : tester les scripts d'installation npm

But : constater qu'un paquet peut exécuter du code dès son installation, puis comparer avec `--ignore-scripts`.

## Le seul paquet à récupérer

Télécharger **[joli-logger-1.0.3.tgz](https://raw.githubusercontent.com/M2P-git/tp-nodejs/main/s04-salon-en-ligne/securite/joli-logger-1.0.3.tgz)** (lien direct), ou retrouver cette archive dans `s04-salon-en-ligne/securite/` après avoir récupéré le dépôt. Les [sources du paquet](joli-logger/) sont également fournies. C'est un paquet local fabriqué pour ce cours. Ne pas le décompresser et ne pas taper `npm install joli-logger` : cette commande chercherait un homonyme sur Internet.

Le code fourni dans `joli-logger/installe.js` écrit seulement `preuve.txt` dans le dossier de test. Il ne lit aucun secret et ne fait aucune connexion réseau. Les noms cités dans les récits d'attaques et `expresss` sont des exemples à étudier, pas des paquets à installer.

## Préparer son PC

1. Avoir Node.js et npm installés. Ouvrir PowerShell, puis vérifier `node --version` et `npm.cmd --version`.
2. Créer un dossier vide `atelier-securite`, par exemple dans Documents.
3. Placer l'archive téléchargée directement dans ce dossier, puis ouvrir ce dossier dans VS Code et son terminal PowerShell.
4. Vérifier `Test-Path ./joli-logger-1.0.3.tgz` : le résultat doit être `True`.

Les commandes ci-dessous sont pour **PowerShell sous Windows**. `npm.cmd` évite le blocage de `npm.ps1` sur certains PC ; sous macOS/Linux, utiliser `npm` et les commandes de lecture de fichiers du système. Aucune modification des réglages globaux de npm n'est nécessaire. Une fois l'archive récupérée, les deux installations locales fonctionnent sans Internet.

## Test 1 : installer avec le script

Depuis `atelier-securite` :

```powershell
mkdir essai
cd essai
npm.cmd init -y
npm.cmd install --ignore-scripts=false --offline --no-audit --no-fund ../joli-logger-1.0.3.tgz
Get-Content preuve.txt
```

Résultat attendu : **`postinstall exécuté`**. On n'a lancé ni import ni programme du paquet : npm a déclenché son `postinstall` pendant l'installation. `--ignore-scripts=false` active les scripts pour cette commande uniquement. `--offline --no-audit --no-fund` garde cette démonstration locale sans requête au registre ; l'audit sera testé séparément sur le projet Express.

Selon la version de npm et la politique de scripts du PC, npm peut afficher un avertissement ou bloquer ce script. S'il est bloqué, conserver la protection et montrer le message à l'enseignant ; ne pas modifier la configuration globale pour forcer la démonstration.

## Test 2 : installer sans le script

Toujours dans `essai`, revenir au dossier parent, puis créer un **autre dossier vide** :

```powershell
cd ..
mkdir prudent
cd prudent
npm.cmd init -y
npm.cmd install --ignore-scripts --offline --no-audit --no-fund ../joli-logger-1.0.3.tgz
Test-Path preuve.txt
npm.cmd ls joli-logger
```

Résultats attendus : **`False`** pour le fichier, et **`joli-logger@1.0.3`** dans la liste des dépendances. Le paquet est installé, son script ne s'est pas exécuté. Ne pas réutiliser `essai` : le fichier du premier test y est déjà présent. Pour recommencer, utiliser deux nouveaux dossiers vides.

## Test 3 : auditer le projet Express

Dans un nouveau terminal, se placer dans **le projet Express créé plus tôt dans la séance** (`C:\rdv` dans le cours), celui qui contient `serveur.mjs`, `package.json` et `package-lock.json`. Adapter le chemin si votre projet est ailleurs :

```powershell
cd C:\rdv
npm.cmd audit
```

Ce test demande Internet. Aucun paquet « audit » à télécharger : la commande est intégrée à npm. Si `package-lock.json` manque, refaire l'installation prévue dans le projet Express avant l'audit. Relever le nombre et la gravité des failles signalées ; le résultat dépend des versions et de la date. Ne pas lancer automatiquement `npm audit fix --force`. Un résultat `0 vulnerabilities` ne prouve pas que le code est sans danger. L'archive locale n'est pas un exercice de détection de logiciel malveillant par l'audit.

## À rendre

- La commande et le résultat du test 1 (`postinstall exécuté`, ou le message de blocage).
- Les résultats du test 2 (`False` et `joli-logger@1.0.3`).
- Le résultat de l'audit du projet Express et une phrase sur sa limite.
- Une phrase expliquant pourquoi `--ignore-scripts` n'empêche pas l'exécution du code lorsqu'on importe ensuite un paquet.

## Pour l'enseignant : refaire l'archive

Après modification des sources, depuis le dossier `securite` :

```powershell
npm.cmd pack ./joli-logger --ignore-scripts --offline
```

Références : [installation et ignore-scripts](https://docs.npmjs.com/cli/v11/commands/npm-install/), [npm pack](https://docs.npmjs.com/cli/v11/commands/npm-pack/), [npm audit](https://docs.npmjs.com/cli/v11/commands/npm-audit/).
