import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Evento, OrarioApertura } from '../../interfaces/pocketbase';
import { OraPipe } from '../../pipes/ora.pipe';
import { PocketbaseService } from '../../services/pocketbase/pocketbase.service';
import { isChiuso, orarioDelGiorno } from '../../utils/orari';
import { Button } from '../button/button';

@Component({
  selector: 'app-hero',
  imports: [Button, DatePipe, OraPipe],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero implements OnInit {
  private readonly pocketbase = inject(PocketbaseService);
  private readonly orari = signal<OrarioApertura[]>([]);

  protected readonly caricamento = signal(true);
  protected readonly prossimoEvento = signal<Evento | null>(null);

  /** Orario di apertura del giorno corrente. */
  protected readonly orarioOggi = computed(() => orarioDelGiorno(this.orari()));

  protected readonly isChiuso = isChiuso;

  async ngOnInit(): Promise<void> {
    // Richieste indipendenti: un errore su una non blocca l'altra.
    const [orari, eventi] = await Promise.allSettled([
      this.pocketbase.getOrari(),
      this.pocketbase.getEventiInProgramma(),
    ]);

    if (orari.status === 'fulfilled') {
      this.orari.set(orari.value);
    } else {
      console.error('Errore nel caricamento degli orari da PocketBase:', orari.reason);
    }

    if (eventi.status === 'fulfilled') {
      this.prossimoEvento.set(eventi.value[0] ?? null);
    } else {
      console.error('Errore nel caricamento degli eventi da PocketBase:', eventi.reason);
    }

    this.caricamento.set(false);
  }
}
