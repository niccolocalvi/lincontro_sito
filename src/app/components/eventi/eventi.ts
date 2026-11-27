import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { PilaScroll } from '../../directives/pila-scroll';
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
  imports: [DatePipe, PilaScroll],
  templateUrl: './eventi.html',
  styleUrl: './eventi.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Eventi implements OnInit {
  private readonly pocketbase = inject(PocketbaseService);
  protected readonly eventi = signal<Evento[]>([]);
  protected readonly caricamento = signal(true);
  protected readonly errore = signal(false);

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

  async ngOnInit(): Promise<void> {
    try {
      const eventi = await this.pocketbase.getEventiInProgramma();
      this.eventi.set(eventi);
    } catch (error) {
      console.error('Errore nel caricamento degli eventi da PocketBase:', error);
      this.errore.set(true);
    } finally {
      this.caricamento.set(false);
    }
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
