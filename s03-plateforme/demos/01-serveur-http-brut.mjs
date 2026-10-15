// Séance 3 : un serveur HTTP avec le seul module node:http, sans framework.
//   npm run demo:http        (ou : node --watch demos/01-serveur-http-brut.mjs)
//   curl.exe http://localhost:3000/sante
//   curl.exe -X POST http://localhost:3000/echo -H "Content-Type: application/json" -d "{\"nom\":\"Awa\"}"
//
// Observez tout ce qu'il faut faire « à la main » : router, lire le corps (un STREAM),
// parser le JSON, gérer les erreurs, écrire les en-têtes… C'est ce que fait un framework.
import { createServer } from 'node:http';

const serveur = createServer((req, res) => {
  // req est un flux LISIBLE (le corps arrive par morceaux), res un flux INSCRIPTIBLE.
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(req.method, url.pathname, Object.fromEntries(url.searchParams));

  if (req.method === 'GET' && url.pathname === '/sante') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ statut: 'ok', uptime: process.uptime() }));
  }

  if (req.method === 'POST' && url.pathname === '/echo') {
    const morceaux = [];
    req.on('data', (morceau) => morceaux.push(morceau)); // Buffer de quelques Kio
    req.on('end', () => {
      try {
        const corps = JSON.parse(Buffer.concat(morceaux).toString('utf8'));
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ recu: corps }));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ erreur: 'JSON invalide' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ erreur: `Route inconnue : ${req.method} ${url.pathname}` }));
});

serveur.listen(3000, () => console.log('http://localhost:3000  (Ctrl+C pour arrêter)'));
