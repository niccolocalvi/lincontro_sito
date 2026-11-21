import { appNavigazione } from './indicazioni';

describe('appNavigazione', () => {
  const destinazione = { lat: 41.94728, lng: 12.15574, nome: "L'Incontro" };

  it('propone Google Maps, Apple Mappe e Waze con le coordinate del locale', () => {
    const app = appNavigazione(destinazione, false);
    expect(app.map((a) => a.nome)).toEqual(['Google Maps', 'Apple Mappe', 'Waze']);
    expect(app.every((a) => a.url.includes('41.94728,12.15574'))).toBe(true);
  });

  it('su Android aggiunge il link geo: per scegliere tra tutte le app', () => {
    const altra = appNavigazione(destinazione, true).at(-1);
    expect(altra?.url).toMatch(/^geo:41\.94728,12\.15574\?q=/);
  });
});
