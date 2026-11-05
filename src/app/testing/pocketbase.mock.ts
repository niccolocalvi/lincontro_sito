import { ComponentFixture } from '@angular/core/testing';
import { Provider } from '@angular/core';
import { Evento, OrarioApertura } from '../interfaces/pocketbase';
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

/** Sostituisce PocketbaseService nei test: nessuna chiamata di rete. */
export function providePocketbaseMock(
  dati: { orari?: OrarioApertura[]; eventi?: Evento[] } = {},
): Provider {
  return {
    provide: PocketbaseService,
    useValue: {
      getOrari: () => Promise.resolve(dati.orari ?? ORARI_MOCK),
      getEventiInProgramma: () => Promise.resolve(dati.eventi ?? EVENTI_MOCK),
      getCategorie: () => Promise.resolve([]),
      getProdotti: () => Promise.resolve([]),
      getMenu: () => Promise.resolve([]),
    } satisfies Partial<PocketbaseService>,
  };
}

/** Attende che le promise del mock siano risolte e la vista aggiornata (app zoneless). */
export async function attendiCaricamento(fixture: ComponentFixture<unknown>): Promise<void> {
  await fixture.whenStable();
  await new Promise((resolve) => setTimeout(resolve));
  await fixture.whenStable();
}
