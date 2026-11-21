import type { LayerSpecification, StyleSpecification } from 'maplibre-gl';

/** Stile vettoriale di base (OpenFreeMap, dati OpenStreetMap): chiaro e minimale, da ricolorare. */
export const URL_STILE_MAPPA = 'https://tiles.openfreemap.org/styles/positron';

/** Colori della mappa presi dalla palette del sito (theme.css). */
const COLORI = {
  sfondo: '#f7f1e8', // --color-page
  residenziale: '#f2e9dc', // --color-surface-soft
  verde: '#e6e0c8',
  bosco: '#ddd6ba',
  acqua: '#cfd7d2',
  edifici: '#e7dccb', // --color-border
  bordoEdifici: '#d9c6ae', // --color-surface-sand
  strada: '#fffcf7', // --color-surface
  bordoStrada: '#e0d0be', // --color-surface-tan
  stradaPrincipale: '#f3dcbf',
  bordoPrincipale: '#d9b98e', // --color-accent-gold
  ferrovia: '#cdbba4', // --color-border-dotted
  confini: '#cdbba4',
  testo: '#5a4334', // --color-body
  testoTenue: '#8a6a4a', // --color-muted-light
  testoAcqua: '#6f8580',
  alone: '#fffcf7', // --color-surface
} as const;

/** Colori per layer dello stile Positron: id layer -> proprietà paint da sovrascrivere. */
const PAINT: Record<string, Record<string, string>> = {
  background: { 'background-color': COLORI.sfondo },
  park: { 'fill-color': COLORI.verde },
  landcover_wood: { 'fill-color': COLORI.bosco },
  landuse_residential: { 'fill-color': COLORI.residenziale },
  water: { 'fill-color': COLORI.acqua },
  waterway: { 'line-color': COLORI.acqua },
  building: { 'fill-color': COLORI.edifici, 'fill-outline-color': COLORI.bordoEdifici },
  road_area_pier: { 'fill-color': COLORI.sfondo },
  road_pier: { 'line-color': COLORI.sfondo },
  highway_path: { 'line-color': COLORI.bordoStrada },
  highway_minor: { 'line-color': COLORI.strada },
  highway_major_casing: { 'line-color': COLORI.bordoStrada },
  highway_major_inner: { 'line-color': COLORI.strada },
  highway_major_subtle: { 'line-color': COLORI.bordoStrada },
  tunnel_motorway_casing: { 'line-color': COLORI.bordoPrincipale },
  tunnel_motorway_inner: { 'line-color': COLORI.stradaPrincipale },
  highway_motorway_casing: { 'line-color': COLORI.bordoPrincipale },
  highway_motorway_inner: { 'line-color': COLORI.stradaPrincipale },
  highway_motorway_subtle: { 'line-color': COLORI.bordoPrincipale },
  highway_motorway_bridge_casing: { 'line-color': COLORI.bordoPrincipale },
  highway_motorway_bridge_inner: { 'line-color': COLORI.stradaPrincipale },
  railway: { 'line-color': COLORI.ferrovia },
  railway_transit: { 'line-color': COLORI.ferrovia },
  railway_service: { 'line-color': COLORI.ferrovia },
  railway_dashline: { 'line-color': COLORI.sfondo },
  railway_transit_dashline: { 'line-color': COLORI.sfondo },
  railway_service_dashline: { 'line-color': COLORI.sfondo },
  boundary_2: { 'line-color': COLORI.confini },
  boundary_3: { 'line-color': COLORI.confini },
  boundary_disputed: { 'line-color': COLORI.confini },
  waterway_line_label: { 'text-color': COLORI.testoAcqua, 'text-halo-color': COLORI.alone },
  water_name_point_label: { 'text-color': COLORI.testoAcqua, 'text-halo-color': COLORI.alone },
  water_name_line_label: { 'text-color': COLORI.testoAcqua, 'text-halo-color': COLORI.alone },
  'highway-name-path': { 'text-color': COLORI.testoTenue, 'text-halo-color': COLORI.alone },
};

/** Nome del luogo: italiano se presente, altrimenti quello locale. */
const NOME = ['coalesce', ['get', 'name:it'], ['get', 'name']];

/**
 * Punti di interesse (negozi, farmacie, scuole, fermate…): Positron non li mostra.
 * Usano le icone dello sprite OpenFreeMap già incluso nello stile.
 */
const LAYER_POI = [
  {
    id: 'poi',
    type: 'symbol',
    source: 'openmaptiles',
    'source-layer': 'poi',
    minzoom: 14,
    filter: ['all', ['==', ['geometry-type'], 'Point'], ['<', ['get', 'rank'], 25]],
    layout: {
      'icon-image': [
        'match',
        ['get', 'subclass'],
        ['florist', 'furniture'],
        ['get', 'subclass'],
        ['get', 'class'],
      ],
      'icon-size': 0.9,
      'text-field': NOME,
      'text-font': ['Noto Sans Regular'],
      'text-size': 11,
      'text-anchor': 'top',
      'text-offset': [0, 0.7],
      'text-max-width': 8,
      'symbol-sort-key': ['get', 'rank'],
    },
    paint: {
      'text-color': COLORI.testoTenue,
      'text-halo-color': COLORI.alone,
      'text-halo-width': 1.2,
      'icon-opacity': 0.85,
    },
  },
] as unknown as LayerSpecification[];

/**
 * Applica la palette del sito allo stile Positron e aggiunge i punti di interesse
 * sotto le etichette dei luoghi.
 * Le etichette senza regola esplicita prendono il colore del testo del sito.
 */
export function applicaTemaMappa(stile: StyleSpecification): StyleSpecification {
  const ricolorati = stile.layers.map((layer) => {
    const paint: Record<string, unknown> = { ...(layer.paint ?? {}) };
    const override = PAINT[layer.id];
    if (override) {
      Object.assign(paint, override);
    } else if (layer.type === 'symbol') {
      paint['text-color'] = COLORI.testo;
      paint['text-halo-color'] = COLORI.alone;
    }
    return { ...layer, paint } as typeof layer;
  });
  const primaEtichettaLuogo = ricolorati.findIndex((l) => l.id.startsWith('label_'));
  const posizione = primaEtichettaLuogo === -1 ? ricolorati.length : primaEtichettaLuogo;
  ricolorati.splice(posizione, 0, ...LAYER_POI);
  return { ...stile, layers: ricolorati };
}
