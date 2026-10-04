// Classes d'erreurs partagées par les exercices (fichier fourni, ne pas modifier).

export class ErreurMetier extends Error {
  constructor(message, statusHttp = 400) {
    super(message);
    this.name = 'ErreurMetier';
    this.statusHttp = statusHttp;
  }
}

export class ErreurValidation extends ErreurMetier {
  constructor(champs) {
    super(`Paramètres invalides : ${champs.join(', ')}`, 400);
    this.name = 'ErreurValidation';
    this.champs = champs;
  }
}
