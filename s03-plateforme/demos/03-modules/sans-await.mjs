// Module ES sans top-level await : il peut être chargé par require() depuis du CommonJS.
export const tarifHT = (ttc, tva = 0.2) => Math.round(ttc / (1 + tva));
