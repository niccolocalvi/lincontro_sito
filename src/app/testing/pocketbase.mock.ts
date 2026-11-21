import { ComponentFixture } from '@angular/core/testing';
import { Provider } from '@angular/core';
import {
  Combo,
  Evento,
  MenuSito,
  MenuSitoCompleto,
  OrarioApertura,
  SezioneMenu,
  VoceMenu,
} from '../interfaces/pocketbase';
import { PocketbaseService } from '../services/pocketbase/pocketbase.service';

const base = { collectionId: '', collectionName: '', created: '', updated: '' };

export const ORARI_MOCK: OrarioApertura[] = [
  'Lunedì',
  'Martedì',
  'Mercoledì',
  'Giovedì',
  'Venerdì',
  'Sabato',
  'Domenica',
].map((day, i) => ({
  ...base,
  id: `orario${i + 1}`,
  legacy_id: i + 1,
  day,
  from: '05:30:00+02',
  to: '20:00:00+02',
}));

export const EVENTI_MOCK: Evento[] = [
  {
    ...base,
    id: 'evento1',
    legacy_id: 1,
    title: 'Lady and the Sax',
    body: '<b>Live Jazz</b>',
    start_at: '2099-07-11 16:30:00.000Z',
    end_at: '2099-07-11 22:00:00.000Z',
    sort_order: 1,
    active: true,
  },
];

function sezione(id: string, menu: string, name: string): SezioneMenu {
  return { ...base, id, menu, name, sort_order: 0, active: true };
}

function voce(
  id: string,
  section: string,
  name: string,
  price: number,
  extra: Partial<VoceMenu> = {},
): VoceMenu {
  return {
    ...base,
    id,
    section,
    name,
    note: '',
    price,
    price_label: '',
    starting_from: false,
    sort_order: 0,
    active: true,
    ...extra,
  };
}

function menuSito(
  id: string,
  slug: string,
  title: string,
  extra: Partial<MenuSito> = {},
): MenuSito {
  return {
    ...base,
    id,
    slug,
    card_title: `Menu\n${title}`,
    card_badge: '',
    card_description: '',
    card_image: '',
    card_image_alt: '',
    title,
    subtitle: '',
    banner_label: '',
    banner_text: '',
    banner_price: 0,
    footnote: '',
    sort_order: 0,
    active: true,
    ...extra,
  };
}

export const MENU_SITO_MOCK: MenuSitoCompleto[] = [
  {
    menu: menuSito('m1', 'colazione', 'Colazione & Caffetteria', { card_badge: 'Dalle 5:30' }),
    immagine: '',
    sezioni: [
      { sezione: sezione('s1', 'm1', 'Caffè'), voci: [voce('v1', 's1', 'Caffè', 1.2)] },
      {
        sezione: sezione('s2', 'm1', 'Cornetteria e dolci'),
        voci: [
          voce('v2', 's2', 'Biscotti', 0.3, { starting_from: true }),
          voce('v3', 's2', 'Biscotti', 30, { note: 'al kg' }),
        ],
      },
      // Sezione senza voci attive: non va mostrata
      { sezione: sezione('s3', 'm1', 'Sezione vuota'), voci: [] },
    ],
  },
  {
    menu: menuSito('m2', 'drink', 'Aperitivo & Drinks', {
      banner_label: 'Fallo Premium',
      banner_text: 'Scegli un gin',
      banner_price: 4,
    }),
    immagine: '',
    sezioni: [
      {
        sezione: sezione('s4', 'm2', 'Birra alla spina'),
        voci: [voce('v4', 's4', 'Con gassosa', 0, { price_label: '4,00 / 6,00 €' })],
      },
    ],
  },
];

export const COMBO_MOCK: Combo[] = [
  {
    ...base,
    id: 'c1',
    name: 'Pranzo',
    label: 'Combo',
    items: ['Primo o Secondo', 'Bibita'],
    price: 9,
    highlight: true,
    sort_order: 1,
    active: true,
  },
];

/** Sostituisce PocketbaseService nei test: nessuna chiamata di rete. */
export function providePocketbaseMock(
  dati: {
    orari?: OrarioApertura[];
    eventi?: Evento[];
    menu?: MenuSitoCompleto[];
    combo?: Combo[];
  } = {},
): Provider {
  return {
    provide: PocketbaseService,
    useValue: {
      getOrari: () => Promise.resolve(dati.orari ?? ORARI_MOCK),
      getEventiInProgramma: () => Promise.resolve(dati.eventi ?? EVENTI_MOCK),
      getCategorie: () => Promise.resolve([]),
      getProdotti: () => Promise.resolve([]),
      getMenu: () => Promise.resolve([]),
      getMenuSito: () => Promise.resolve(dati.menu ?? MENU_SITO_MOCK),
      getCombo: () => Promise.resolve(dati.combo ?? COMBO_MOCK),
    } satisfies Partial<PocketbaseService>,
  };
}

/** Attende che le promise del mock siano risolte e la vista aggiornata (app zoneless). */
export async function attendiCaricamento(fixture: ComponentFixture<unknown>): Promise<void> {
  await fixture.whenStable();
  await new Promise((resolve) => setTimeout(resolve));
  await fixture.whenStable();
}
