# Séance 2 : le modèle d'exécution de Node.js

> Un seul thread exécute votre JavaScript, et pourtant Node sert des milliers de
> clients simultanés. Cette séance explique **comment**, et surtout **quand cela cesse
> de fonctionner**. Toutes les démonstrations se mesurent : on ne croit rien, on observe.

## Objectifs

À la fin de la séance, vous savez :

- décrire le rôle de V8, de libuv, de la boucle d'événements et du pool de threads ;
- prédire l'ordre d'exécution des synchrones, `nextTick`, microtâches, `setTimeout`,
  `setImmediate`, et des callbacks d'E/S ;
- reconnaître du code qui **bloque** la boucle, et le corriger (découpage, worker) ;
- paralléliser des attentes indépendantes, limiter la concurrence, poser des délais ;
- expliquer pourquoi une promesse rejetée non gérée **arrête** le processus ;
- traiter un gros fichier avec un stream plutôt que de le charger en mémoire.

## Récupérer la séance

Depuis le dossier du dépôt (voir le [README principal](../README.md), section 3) :

```powershell
.\scripts\mettre-a-jour.ps1      # Windows
./scripts/mettre-a-jour.sh       # macOS / Linux
```

La correction de la séance 1 est arrivée dans `s01-javascript/`. Comparez-la avec votre
travail : `git diff travail/s01 main -- s01-javascript/exercices/`

## Partie 1 : démonstrations

| Démo | Ce qu'on observe | Commande |
|---|---|---|
| `01-ordre-execution.cjs` puis `.mjs` | Ordre synchrone, nextTick, microtâches, timers, check. **Différence CommonJS / ESM** | `node demos/01-ordre-execution.cjs` |
| `02-immediate-vs-timeout.mjs` | Dans un callback d'E/S, `setImmediate` passe toujours avant `setTimeout(0)` | `node demos/02-immediate-vs-timeout.mjs` |
| `03-serveur-bloquant.mjs` + `client-mesure.mjs` | Un calcul de 5 s bloque **tous** les clients | terminal 1 : `node demos/03-serveur-bloquant.mjs` · terminal 2 : `node demos/client-mesure.mjs 3000` |
| `04-threadpool.mjs` | 8 hachages, 4 threads : deux « vagues » | `node demos/04-threadpool.mjs` puis avec `UV_THREADPOOL_SIZE=8` |
| `05-sequentiel-vs-parallele.mjs` | 900 ms contre 300 ms pour le même travail | `node demos/05-sequentiel-vs-parallele.mjs` |
| `06-rejet-non-gere.mjs` | Une promesse oubliée fait planter le processus | `node demos/06-rejet-non-gere.mjs` |
| `07-worker-threads.mjs` + `client-mesure.mjs` | Le même calcul dans un worker : `/rapide` reste rapide | terminal 1 : `node demos/07-worker-threads.mjs` · terminal 2 : `node demos/client-mesure.mjs 3001` |
| `08-streams-memoire.mjs` | 200 Mo : ~64 Mo de RAM en stream, ~256 Mo avec `readFile` | voir l'en-tête du fichier |
| `09-timeout-abort.mjs` | Abandonner un appel réseau trop lent | `node demos/09-timeout-abort.mjs` (Internet requis) |

Variable d'environnement sous PowerShell : `$env:UV_THREADPOOL_SIZE=8; node demos/04-threadpool.mjs`
(puis `Remove-Item Env:UV_THREADPOOL_SIZE` pour revenir à la valeur par défaut).

## Partie 2 : exercices

```bash
cd s02-modele-execution
node --test
```

| Exercice | Fichier à modifier | Notion |
|---|---|---|
| 1 | `exercices/ex1-prediction.mjs` | Prédire l'ordre exact de 12 affichages, **justifier chaque position** |
| 2 | `exercices/ex2-tableau-de-bord.mjs` | Paralléliser sans casser les dépendances ; échec toléré |
| 3 | `exercices/ex3-avec-delai.mjs` | Délai maximal, `AbortController`, nettoyage des minuteurs |
| 4 | `exercices/ex4-limite-concurrence.mjs` | Exécuter N tâches, jamais plus de K à la fois |
| 5 (bonus) | `exercices/ex5-bonus-ne-pas-bloquer.mjs` | Découper un calcul pour laisser respirer la boucle |

Exercice 1 : interdit d'exécuter `ex1-programme.mjs` avant d'avoir écrit **et justifié**
votre prédiction. Le test le lancera pour vous.

## Fin de séance

```bash
git switch -c travail/s02
git add -A
git commit -m "S02 : mes exercices"
git push -u perso travail/s02
```

## Pour la séance 3

- Installer **pnpm** (`npm install -g pnpm`) et vérifier `pnpm --version`.
- Lire la page « The Node.js Event Loop » de la documentation officielle (nodejs.org,
  rubrique *Learn*).
