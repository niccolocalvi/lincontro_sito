import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import type { Map as MappaMaplibre } from 'maplibre-gl';
import { DatiAttivitaService } from '../../services/dati-attivita/dati-attivita.service';
import { appNavigazione } from '../../utils/indicazioni';
import { applicaTemaMappa, URL_STILE_MAPPA } from '../../utils/mappa-tema';

const ZOOM = 14.5;

/** Testi dei controlli MapLibre in italiano. */
const TESTI_MAPPA = {
  'NavigationControl.ZoomIn': 'Ingrandisci',
  'NavigationControl.ZoomOut': 'Riduci',
  'NavigationControl.ResetBearing': 'Ripristina orientamento',
  'AttributionControl.ToggleAttribution': 'Mostra crediti',
  'CooperativeGesturesHandler.WindowsHelpText': 'Usa Ctrl + rotella per ingrandire la mappa',
  'CooperativeGesturesHandler.MacHelpText': 'Usa ⌘ + rotella per ingrandire la mappa',
  'CooperativeGesturesHandler.MobileHelpText': 'Usa due dita per spostare la mappa',
};

@Component({
  selector: 'app-posizione',
  templateUrl: './posizione.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Posizione {
  protected readonly dati = inject(DatiAttivitaService).dati;
  protected readonly appNavigazione = appNavigazione(
    { ...this.dati.coordinate, nome: this.dati.nomeCommerciale },
    typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent),
  );
  protected readonly stato = signal<'attesa' | 'pronta' | 'errore'>('attesa');

  private readonly contenitore = viewChild.required<ElementRef<HTMLElement>>('mappa');
  private readonly popupIndicazioni =
    viewChild.required<ElementRef<HTMLDialogElement>>('indicazioni');
  private mappa?: MappaMaplibre;

  constructor() {
    const destroyRef = inject(DestroyRef);

    // La libreria (~800 kB) si scarica solo quando la sezione sta per entrare nello schermo
    afterNextRender(() => {
      const el = this.contenitore().nativeElement;
      if (typeof IntersectionObserver === 'undefined') return;
      const osservatore = new IntersectionObserver(
        (voci) => {
          if (voci.some((v) => v.isIntersecting)) {
            osservatore.disconnect();
            void this.creaMappa(el);
          }
        },
        { rootMargin: '400px' },
      );
      osservatore.observe(el);
      destroyRef.onDestroy(() => {
        osservatore.disconnect();
        this.mappa?.remove();
      });
    });
  }

  protected apriIndicazioni(): void {
    this.popupIndicazioni().nativeElement.showModal();
  }

  protected chiudiIndicazioni(): void {
    this.popupIndicazioni().nativeElement.close();
  }

  /** Click sullo sfondo scuro del popup (fuori dal riquadro): chiude. */
  protected clickPopup(evento: MouseEvent): void {
    if (evento.target === evento.currentTarget) this.chiudiIndicazioni();
  }

  private async creaMappa(el: HTMLElement): Promise<void> {
    rimuoviVecchioConsenso();
    try {
      const [modulo, risposta] = await Promise.all([
        import('maplibre-gl'),
        fetch(URL_STILE_MAPPA),
        caricaCssMappa(),
      ]);
      // maplibre-gl è CommonJS: nella build di produzione l'import dinamico restituisce
      // il modulo dentro `default`, mentre in sviluppo (ng serve) espone direttamente le classi.
      const maplibre = 'Map' in modulo ? modulo : (modulo as { default: typeof modulo }).default;
      if (!risposta.ok) throw new Error(`Stile mappa: HTTP ${risposta.status}`);
      const stile = applicaTemaMappa(await risposta.json());

      const centro: [number, number] = [this.dati.coordinate.lng, this.dati.coordinate.lat];
      const mappa = new maplibre.Map({
        container: el,
        style: stile,
        center: centro,
        zoom: ZOOM,
        cooperativeGestures: true,
        attributionControl: { compact: true },
        locale: TESTI_MAPPA,
      });
      mappa.addControl(new maplibre.NavigationControl({ showCompass: false }), 'top-right');

      const segnaposto = creaSegnaposto(this.dati.nomeCommerciale);
      segnaposto.addEventListener('click', () => this.apriIndicazioni());
      new maplibre.Marker({ element: segnaposto, anchor: 'bottom' }).setLngLat(centro).addTo(mappa);

      this.mappa = mappa;
      mappa.once('load', () => {
        this.stato.set('pronta');
        // Crediti compatti: chiusi all'avvio, si aprono con il pulsante "i"
        el.querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show');
      });
      mappa.on('error', (e) => console.error('Errore mappa', e.error));
    } catch (errore) {
      console.error('Mappa non disponibile', errore);
      this.stato.set('errore');
    }
  }
}

/** Segnaposto con i colori del brand: etichetta col nome sopra una goccia arancio con tazzina. */
function creaSegnaposto(nome: string): HTMLElement {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'segnaposto-mappa';
  el.setAttribute('aria-label', `${nome}: indicazioni stradali`);
  const etichetta = document.createElement('span');
  etichetta.className = 'segnaposto-etichetta';
  etichetta.textContent = nome;
  const goccia = document.createElement('span');
  goccia.className = 'segnaposto-goccia';
  goccia.innerHTML = '<i class="fa-solid fa-mug-hot" aria-hidden="true"></i>';
  el.append(etichetta, goccia);
  return el;
}

/**
 * Il CSS di MapLibre è un bundle separato (`maplibre.css`, vedi angular.json, "inject": false):
 * si scarica solo insieme alla mappa invece che con il resto della pagina.
 */
function caricaCssMappa(): Promise<void> {
  if (document.querySelector('link[data-css-mappa]')) return Promise.resolve();
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'maplibre.css';
    link.dataset['cssMappa'] = '';
    link.onload = link.onerror = () => resolve();
    document.head.append(link);
  });
}

/** Pulisce la preferenza salvata dalla vecchia mappa Google (non più usata). */
function rimuoviVecchioConsenso(): void {
  try {
    localStorage.removeItem('mapConsent');
  } catch {
    // Storage non disponibile: non c'è nulla da pulire.
  }
}
