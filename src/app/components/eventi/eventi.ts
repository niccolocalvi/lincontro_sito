import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  OnInit,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Evento } from '../../interfaces/pocketbase';
import { PocketbaseService } from '../../services/pocketbase/pocketbase.service';

/** Colori dei pass, assegnati a rotazione. Tutte le coppie rispettano il contrasto AA. */
const COLORI_PASS = [
  { bg: '#e8821e', fg: '#24170f', ctaBg: '#24170f', ctaFg: '#fffcf7' }, // arancio
  { bg: '#f7f1e8', fg: '#24170f', ctaBg: '#24170f', ctaFg: '#fffcf7' }, // crema
  { bg: '#d9c6ae', fg: '#24170f', ctaBg: '#24170f', ctaFg: '#fffcf7' }, // sabbia
  { bg: '#4a3426', fg: '#fffcf7', ctaBg: '#fffcf7', ctaFg: '#24170f' }, // caffè
  { bg: '#fffcf7', fg: '#24170f', ctaBg: '#24170f', ctaFg: '#fffcf7' }, // avorio
] as const;

const WHATSAPP_NUMERO = '393343874529';

/** Scroll (in frazione di viewport) che serve per passare al pass successivo. Uguale a eventi.css. */
const CORSA_PER_PASS = 0.55;
/** Spazio da lasciare libero sotto il palco bloccato, oltre al suo `top` sticky. */
const MARGINE_PALCO = 16;
/** Testate dei pass successivi visibili al massimo; scendono se lo schermo è basso. */
const MAX_ANTEPRIME = 3;

interface Pass {
  evento: Evento;
  colori: (typeof COLORI_PASS)[number];
  whatsapp: string;
}

/** PocketBase restituisce "2099-07-11 16:30:00.000Z": lo rendiamo ISO per Date. */
function dataEvento(valore: string): Date {
  return new Date(valore.replace(' ', 'T'));
}

function giorniDaOggi(data: Date): number {
  const oggi = new Date();
  const inizioOggi = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate());
  const inizioEvento = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  return Math.max(0, Math.round((inizioEvento.getTime() - inizioOggi.getTime()) / 86_400_000));
}

@Component({
  selector: 'app-eventi',
  imports: [DatePipe],
  templateUrl: './eventi.html',
  styleUrl: './eventi.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Eventi implements OnInit {
  private readonly pocketbase = inject(PocketbaseService);
  private readonly injector = inject(Injector);

  private readonly binario = viewChild<ElementRef<HTMLElement>>('binario');
  private readonly palco = viewChild<ElementRef<HTMLElement>>('palco');

  protected readonly eventi = signal<Evento[]>([]);
  protected readonly caricamento = signal(true);
  protected readonly errore = signal(false);

  /** Id del pass aperto: uno alla volta, il primo è aperto all'avvio. */
  protected readonly apertoId = signal<string | null>(null);

  /**
   * true = la pila resta ferma sullo schermo e lo scroll apre un pass alla volta.
   * Vale solo se la pila (con il pass più alto aperto) entra nello schermo.
   */
  protected readonly bloccato = signal(false);

  /** Quante testate dei pass successivi restano visibili (le altre sono bordi sottili). */
  protected readonly anteprime = signal(MAX_ANTEPRIME);

  protected readonly indiceAperto = computed(() =>
    Math.max(
      0,
      this.eventi().findIndex((e) => e.id === this.apertoId()),
    ),
  );

  protected readonly pass = computed<Pass[]>(() =>
    this.eventi().map((evento, i) => ({
      evento,
      colori: COLORI_PASS[i % COLORI_PASS.length],
      whatsapp: this.linkWhatsapp(evento),
    })),
  );

  protected readonly conteggio = computed(() => String(this.eventi().length).padStart(2, '0'));

  /** Giorni che mancano al prossimo evento (0 = oggi). */
  protected readonly giorniAlProssimo = computed(() => {
    const primo = this.eventi()[0];
    return primo ? giorniDaOggi(dataEvento(primo.start_at)) : null;
  });

  constructor() {
    // Listener solo nel browser, rimossi alla distruzione del componente.
    afterNextRender(() => {
      // Calcolo leggero (una getBoundingClientRect) e il signal cambia solo al cambio di pass
      const onScroll = () => this.aggiornaDaScroll();
      // Si rimisura solo se cambia la larghezza: su mobile l'altezza cambia di
      // continuo quando le barre del browser compaiono/spariscono durante lo scroll.
      let larghezza = window.innerWidth;
      const onResize = () => {
        if (window.innerWidth === larghezza) return;
        larghezza = window.innerWidth;
        this.misura();
        this.aggiornaDaScroll();
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize, { passive: true });
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
      });
    });
  }

  private readonly destroyRef = inject(DestroyRef);

  async ngOnInit(): Promise<void> {
    try {
      const eventi = await this.pocketbase.getEventiInProgramma();
      this.eventi.set(eventi);
      this.apertoId.set(eventi[0]?.id ?? null);
      // Misura la pila appena è nel DOM per decidere se bloccarla.
      afterNextRender(
        () => {
          this.misura();
          this.aggiornaDaScroll();
        },
        { injector: this.injector },
      );
    } catch (error) {
      console.error('Errore nel caricamento degli eventi da PocketBase:', error);
      this.errore.set(true);
    } finally {
      this.caricamento.set(false);
    }
  }

  /** Clic su una testata: in modalità bloccata scorre fino al pass, altrimenti apre/chiude. */
  protected seleziona(indice: number): void {
    const id = this.eventi()[indice]?.id;
    if (!id) return;

    const binario = this.binario()?.nativeElement;
    if (!this.bloccato() || !binario) {
      this.apertoId.update((attuale) => (attuale === id ? null : id));
      return;
    }

    this.apertoId.set(id);
    const top = window.scrollY + binario.getBoundingClientRect().top - this.topPalco();
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: top + indice * window.innerHeight * CORSA_PER_PASS,
      behavior: ridotto ? 'auto' : 'smooth',
    });
  }

  /**
   * Decide se la pila può restare ferma sullo schermo e quante anteprime mostrare.
   * Misura reale: simula nel DOM ogni pass aperto (con 3, 2, 1, 0 anteprime) e prende
   * l'altezza massima. Pochi elementi, eseguita solo al caricamento e al cambio di larghezza.
   */
  private misura(): void {
    const binario = this.binario()?.nativeElement;
    const palco = this.palco()?.nativeElement;
    const lista = palco?.querySelector('ol');
    const n = this.eventi().length;
    if (!binario || !palco || !lista || n < 2) {
      this.bloccato.set(false);
      return;
    }

    const passi = Array.from(lista.querySelectorAll<HTMLElement>(':scope > .pass'));
    const prima = passi.map((p) => ({
      aperto: p.hasAttribute('data-open'),
      visto: p.classList.contains('pass--visto'),
      lontano: p.classList.contains('pass--lontano'),
    }));

    const imposta = (aperto: number, anteprime: number) =>
      passi.forEach((p, j) => {
        p.toggleAttribute('data-open', j === aperto);
        p.classList.toggle('pass--visto', j < aperto);
        p.classList.toggle('pass--lontano', j > aperto + anteprime);
      });

    const altezzaMassima = (anteprime: number) => {
      let massima = 0;
      for (let i = 0; i < passi.length; i++) {
        imposta(i, anteprime);
        massima = Math.max(massima, palco.offsetHeight);
      }
      return massima;
    };

    // .is-measuring = stile compatto da bloccata, senza transizioni
    binario.classList.add('is-measuring');
    const spazio = window.innerHeight - this.topPalco() - MARGINE_PALCO;
    let anteprime = Math.min(MAX_ANTEPRIME, n - 1);
    let altezza = altezzaMassima(anteprime);
    while (anteprime > 0 && altezza > spazio) {
      anteprime--;
      altezza = altezzaMassima(anteprime);
    }

    // Ripristina esattamente lo stato gestito da Angular
    passi.forEach((p, j) => {
      p.toggleAttribute('data-open', prima[j].aperto);
      p.classList.toggle('pass--visto', prima[j].visto);
      p.classList.toggle('pass--lontano', prima[j].lontano);
    });
    binario.classList.remove('is-measuring');

    // altezza 0 = layout non disponibile (es. test): resta la modalità a clic
    this.anteprime.set(anteprime);
    this.bloccato.set(altezza > 0 && altezza <= spazio);
  }

  private aggiornaDaScroll(): void {
    const binario = this.binario()?.nativeElement;
    const n = this.eventi().length;
    if (!this.bloccato() || !binario || n === 0) return;

    const corsa = window.innerHeight * CORSA_PER_PASS;
    const scorso = this.topPalco() - binario.getBoundingClientRect().top;
    const indice = Math.min(n - 1, Math.max(0, Math.floor(scorso / corsa + 0.5)));
    const id = this.eventi()[indice].id;
    if (this.apertoId() !== id) this.apertoId.set(id);
  }

  private topPalco(): number {
    const palco = this.palco()?.nativeElement;
    return palco ? parseFloat(getComputedStyle(palco).top) || 88 : 88;
  }

  /** "Oggi", "Domani" o "Tra N giorni" per la testata del primo pass. */
  protected quando(evento: Evento): string {
    const giorni = giorniDaOggi(dataEvento(evento.start_at));
    if (giorni === 0) return 'Oggi';
    if (giorni === 1) return 'Domani';
    return `Tra ${giorni} giorni`;
  }

  private linkWhatsapp(evento: Evento): string {
    const giorno = dataEvento(evento.start_at).toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    const testo =
      `Ciao! Vorrei prenotare un tavolo per "${evento.title}" (${giorno}).\n\n` +
      `*Nome*: \n*Numero persone*: `;
    return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(testo)}`;
  }
}
