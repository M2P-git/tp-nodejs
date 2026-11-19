// public/app.js : ce code tourne dans le NAVIGATEUR
const liste = document.querySelector('#liste');
const formulaire = document.querySelector('#formulaire');
const message = document.querySelector('#message');

async function afficher() {
  const reponse = await fetch('/rdv');
  const rdvs = await reponse.json();
  liste.innerHTML = '';
  for (const rdv of rdvs) {
    const li = document.createElement('li');
    li.textContent = `${rdv.heure}  ${rdv.client}`;
    liste.append(li);
  }
}

formulaire.addEventListener('submit', async (evenement) => {
  evenement.preventDefault();
  const reponse = await fetch('/rdv', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client: formulaire.client.value,
      heure: formulaire.heure.value,
    }),
  });
  const corps = await reponse.json();
  message.textContent = reponse.ok ? 'Réservé !' : corps.erreur;
  message.className = reponse.ok ? 'ok' : 'erreur';
  afficher();
});

afficher();
setInterval(afficher, 2000);
