import type { StyleSpecification } from 'maplibre-gl';
import { applicaTemaMappa } from './mappa-tema';

describe('applicaTemaMappa', () => {
  const stile = {
    version: 8,
    sources: {},
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': '#fff' } },
      { id: 'label_city', type: 'symbol', source: 'x', paint: { 'text-color': '#000' } },
      { id: 'sconosciuto', type: 'fill', source: 'x', paint: { 'fill-color': '#123' } },
    ],
  } as unknown as StyleSpecification;

  it('ricolora i layer noti e le etichette, lascia invariati gli altri', () => {
    const layers = applicaTemaMappa(stile).layers as unknown as {
      paint: Record<string, string>;
    }[];
    const [sfondo, etichetta, altro] = [layers[0], layers[2], layers[3]];
    expect(sfondo.paint['background-color']).toBe('#f7f1e8');
    expect(etichetta.paint['text-color']).toBe('#5a4334');
    expect(altro.paint['fill-color']).toBe('#123');
  });

  it('aggiunge i punti di interesse prima delle etichette dei luoghi', () => {
    expect(applicaTemaMappa(stile).layers.map((l) => l.id)).toEqual([
      'background',
      'poi',
      'label_city',
      'sconosciuto',
    ]);
  });
});
