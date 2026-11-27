import {
  DestroyRef,
  Directive,
  ElementRef,
  Injector,
  PLATFORM_ID,
  afterNextRender,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Scroll (in frazione di viewport) per passare al pass successivo. Uguale a .pila-runway in styles.css. */
const CORSA_PER_PASS = 0.55;
/** Spazio libero sotto il palco bloccato, oltre al suo `top` sticky. */
const MARGINE_PALCO = 16;
/** Testate dei pass successivi visibili al massimo; scendono se lo schermo è basso. */
const MAX_ANTEPRIME = 3;
/** `top` sticky del palco se non leggibile dallo stile (5.5rem). */
const TOP_PALCO = 88;

/**
 * Pila di pass "stile Wallet" guidata dallo scroll (mobile first).
 *
 * Va sul binario (`.pila-track`), che contiene il palco (`.pila-stage`) con i pass
 * (`.pass`) e il distanziatore `.pila-runway`. Se la pila entra nello schermo il palco
 * resta fermo (sticky) e ogni tratto di scroll apre il pass successivo; altrimenti si
 * apre/chiude con il clic. Gli stili sono in styles.css (sezione PILA DI PASS).
 *
 * Nel template: `#pila="pila"`, poi `pila.aperto(i)`, `pila.visto(i)`, `pila.lontano(i)`,
 * `pila.seleziona(i)`, `pila.indice()`, `pila.bloccato()`.
 */
@Directive({
  selector: '[appPilaScroll]',
  exportAs: 'pila',
  host: {
    class: 'pila-track',
    '[class.is-pinned]': 'bloccato()',
    '[style.--n]': 'numero()',
  },
})
export class PilaScroll {
  /** Numero di pass nella pila. */
  readonly numero = input.required<number>({ alias: 'appPilaScroll' });

  /** Indice del pass aperto (-1 = nessuno, possibile solo nella modalità a clic). */
  readonly indice = signal(0);
  /** true = palco fermo sullo schermo e apertura guidata dallo scroll. */
  readonly bloccato = signal(false);
  /** Quante testate dei pass successivi restano visibili (le altre sono bordi sottili). */
  readonly anteprime = signal(MAX_ANTEPRIME);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Nuovi pass: si riparte dal primo e si rimisura appena sono nel DOM.
    effect(() => {
      this.numero();
      untracked(() => this.indice.set(0));
      afterNextRender(
        () => {
          this.misura();
          this.aggiornaDaScroll();
        },
        { injector: this.injector },
      );
    });

    afterNextRender(() => {
      // Calcolo leggero (una getBoundingClientRect); il signal cambia solo al cambio di pass.
      const onScroll = () => this.aggiornaDaScroll();
      // Si rimisura solo se cambia la larghezza: su mobile l'altezza cambia di continuo
      // quando le barre del browser compaiono/spariscono durante lo scroll.
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

  aperto(i: number): boolean {
    return this.indice() === i;
  }

  /** Pass già superato: da bloccata diventa un bordo sottile in alto. */
  visto(i: number): boolean {
    return this.indice() >= 0 && i < this.indice();
  }

  /** Pass oltre le anteprime: da bloccata diventa un bordo sottile in basso. */
  lontano(i: number): boolean {
    return i > Math.max(this.indice(), 0) + this.anteprime();
  }

  /** Clic su una testata: da bloccata scorre fino al pass, altrimenti apre/chiude. */
  seleziona(i: number): void {
    if (!this.bloccato() || !this.browser) {
      this.indice.update((attuale) => (attuale === i ? -1 : i));
      return;
    }

    this.indice.set(i);
    const top = window.scrollY + this.host.getBoundingClientRect().top - this.topPalco();
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: top + i * window.innerHeight * CORSA_PER_PASS,
      behavior: ridotto ? 'auto' : 'smooth',
    });
  }

  /**
   * Decide se la pila può restare ferma e quante anteprime mostrare.
   * Misura reale: simula nel DOM ogni pass aperto (con 3, 2, 1, 0 anteprime) e prende
   * l'altezza massima. Pochi elementi; gira solo al caricamento e al cambio di larghezza.
   */
  private misura(): void {
    const palco = this.palco();
    const passi = palco ? Array.from(palco.querySelectorAll<HTMLElement>('.pass')) : [];
    if (!palco || passi.length < 2) {
      this.bloccato.set(false);
      if (palco) palco.style.minHeight = '';
      return;
    }

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
    this.host.classList.add('is-measuring');
    const spazio = window.innerHeight - this.topPalco() - MARGINE_PALCO;
    let anteprime = Math.min(MAX_ANTEPRIME, passi.length - 1);
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
    this.host.classList.remove('is-measuring');

    // altezza 0 = layout non disponibile (es. test): resta la modalità a clic
    const bloccato = altezza > 0 && altezza <= spazio;
    this.anteprime.set(anteprime);
    this.bloccato.set(bloccato);
    // Palco ad altezza fissa (la massima): aprendo pass di altezze diverse
    // il contenuto sotto la pila non si sposta.
    palco.style.minHeight = bloccato ? `${altezza}px` : '';
  }

  /** Da bloccata apre il pass corrispondente a quanto si è scorso nel binario. */
  private aggiornaDaScroll(): void {
    const n = this.numero();
    if (!this.bloccato() || n === 0) return;

    const corsa = window.innerHeight * CORSA_PER_PASS;
    const scorso = this.topPalco() - this.host.getBoundingClientRect().top;
    const indice = Math.min(n - 1, Math.max(0, Math.floor(scorso / corsa + 0.5)));
    if (this.indice() !== indice) this.indice.set(indice);
  }

  private palco(): HTMLElement | null {
    return this.host.querySelector<HTMLElement>('.pila-stage');
  }

  private topPalco(): number {
    const palco = this.palco();
    return palco ? parseFloat(getComputedStyle(palco).top) || TOP_PALCO : TOP_PALCO;
  }
}
