# « La machine » du cours : Node.js 24 LTS + Git, sans rien installer sur votre ordinateur.
# Construite une seule fois par `docker compose up -d --build` (environ 1 minute).
FROM node:24-bookworm-slim

# Git (commit, diff), curl (appeler vos propres API), procps (ps, top), nano (édition rapide)
RUN apt-get update \
 && apt-get install -y --no-install-recommends git curl ca-certificates procps nano \
 && rm -rf /var/lib/apt/lists/* \
 # le dossier du cours appartient à un autre utilisateur que celui du conteneur : on autorise Git
 && git config --system --add safe.directory '*'

WORKDIR /work

# Le conteneur reste allumé tant qu'on ne l'éteint pas : on s'y connecte avec `docker compose exec`
CMD ["sleep", "infinity"]
