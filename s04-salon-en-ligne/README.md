# Séance 4 : votre salon en ligne (npm, Express, une première API web)

> L'outil `rdv` de la séance 3 devient une application web : une API Express qui reçoit
> des requêtes HTTP, et une page qui l'utilise, jusque sur votre téléphone. Les règles du
> salon ne changent pas : seul le dialogue passe du terminal au web.

## Objectifs

- Décrire un projet avec `package.json` ; installer un paquet ; comprendre `node_modules`,
  le fichier de verrouillage, `npm ci` et les versions sémantiques.
- Juger une dépendance avant de l'installer : scripts d'installation, typosquatting,
  limites de `npm audit`.
- Lire une requête et une réponse HTTP ; choisir le bon code (`200`, `201`, `400`, `404`,
  `409`, `500`).
- Écrire une API Express : `GET /rdv`, `POST /rdv`, le middleware `express.json()`, la
  validation des données reçues.
- Servir une page web avec `express.static`, et l'utiliser depuis un téléphone.

## Préparation

On repart de **votre** dossier `C:\rdv` de la séance 3 (`agenda.mjs`, `stockage.mjs`,
`rdv.mjs`, `rdv.json`).

```powershell
cd C:\rdv
npm init -y
npm pkg set type=module
npm pkg set private=true --json
npm install express
```

## Contenu de ce dossier

| Fichier | Rôle | À copier dans |
|---|---|---|
| `public/index.html` | la page du salon : la liste, le formulaire | `C:\rdv\public\` |
| `public/style.css` | la mise en forme (rien à apprendre ici) | `C:\rdv\public\` |
| `public/app.js` | le code qui tourne dans le **navigateur** : `fetch`, `await`, `textContent` | `C:\rdv\public\` |
| `lina.json`, `awa.json`, `fatou.json`, `lea.json`, `ali.json` | corps JSON pour tester l'API avec `curl.exe` | `C:\rdv\` |

Les fichiers de `public/` sont expliqués dans les diapositives (section « Une vraie page
web ») : on les lit, on ne les écrit pas.

## Vérifier votre API

Serveur lancé avec `npm run dev`, dans un **second** terminal :

```powershell
curl.exe -i http://localhost:3000/rdv                          # 200 et la liste triée
curl.exe -i --json '@lina.json' http://localhost:3000/rdv      # 201 Created
curl.exe -i --json '@fatou.json' http://localhost:3000/rdv     # 409 : 14:00 est pris par Awa
curl.exe -i --json '@lea.json' http://localhost:3000/rdv       # 400 : le salon est fermé à 20:00
curl.exe -i --json '@ali.json' http://localhost:3000/rdv       # 400 après la validation
```

Dans Windows PowerShell, écrivez bien `curl.exe` (et non `curl`, qui est un alias d'une
autre commande) et gardez les apostrophes autour de `'@lina.json'`.

Puis ouvrez **http://localhost:3000** dans le navigateur, et réservez depuis la page.

## Exercices

1. **`GET /horaires`** : renvoyer `{"ouverture":"09:00","fermeture":"19:00"}`, à partir des
   constantes d'`agenda.mjs`.
2. **`DELETE /rdv/:client`** : annuler les rendez-vous d'un client et renvoyer
   `{"annules": n}` (`curl.exe -X DELETE http://localhost:3000/rdv/Moussa`).
3. **Valider à l'entrée** : refuser un rendez-vous sans client ou sans heure
   (`ali.json`) avec un `400` et le message `client et heure sont obligatoires`, puis une
   heure qui n'est pas un texte (`"heure": 14`).
4. **Pour aller plus loin** : un bouton « Annuler » dans la page (`fetch` avec
   `method: 'DELETE'`) et une route `GET /rdv/prochain` (le premier rendez-vous, ou un
   `404` en JSON s'il n'y en a aucun).

La correction sera publiée à la séance suivante.

## Avec Docker (chemin B)

Votre dossier `rdv` doit se trouver dans le dossier du dépôt, partagé avec le conteneur
(`/work`). Lancez `npm install` et `npm run dev` **dans** le conteneur. Le port 3000 est
déjà publié : la page reste accessible sur http://localhost:3000. Dans le terminal du
conteneur (bash), `curl` est le vrai curl : `curl -i --json @lina.json http://localhost:3000/rdv`.
Si une modification faite depuis Windows n'est pas prise en compte par `--watch`,
relancez le serveur (Ctrl + C, puis `npm run dev`).
