import { OrarioApertura } from '../interfaces/pocketbase';

const GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];

/** "05:30:00+02" -> "05:30" */
export function formattaOra(ora: string): string {
  return ora ? ora.substring(0, 5) : '';
}

/** Giorno di chiusura se mancano gli orari o coincidono. */
export function isChiuso(orario: OrarioApertura): boolean {
  return !orario.from || !orario.to || orario.from === orario.to;
}

/** Restituisce l'orario del giorno indicato (default: oggi), cercandolo per nome del giorno. */
export function orarioDelGiorno(
  orari: OrarioApertura[],
  data: Date = new Date(),
): OrarioApertura | undefined {
  const giorno = GIORNI[data.getDay()];
  return orari.find((o) => o.day?.trim().toLowerCase() === giorno);
}
