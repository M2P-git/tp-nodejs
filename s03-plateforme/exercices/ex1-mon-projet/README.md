# ex1-mon-projet

Squelette de projet Node.js (séance 3, exercice 1).

## Prérequis

- Node.js 24 LTS ou plus récent (`node --version`)

## Installation

```bash
npm ci                 # installe exactement les versions du package-lock.json
cp .env.example .env   # PowerShell : Copy-Item .env.example .env
```

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | Démarre le serveur et le relance à chaque modification (`node --watch`) |
| `npm start` | Démarre le serveur (production) |
| `npm test` | Lance les tests (`node --test`) |

Le serveur répond sur `http://localhost:3000/sante`.
