import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { PocketbaseService } from '../../services/pocketbase/pocketbase.service';
import { Evento, OrarioApertura } from '../../interfaces/pocketbase';
import { formattaOra, isChiuso, orarioDelGiorno } from '../../utils/orari';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  imports: [ButtonComponent, DatePipe],
})
export class HeroComponent implements OnInit {
  private readonly pocketbase = inject(PocketbaseService);

  readonly caricamento = signal(true);
  private readonly orari = signal<OrarioApertura[]>([]);
  readonly prossimoEvento = signal<Evento | null>(null);

  /** Orario di apertura del giorno corrente (da PocketBase). */
  readonly orarioOggi = computed(() => orarioDelGiorno(this.orari()));

  readonly formattaOra = formattaOra;
  readonly isChiuso = isChiuso;

  async ngOnInit(): Promise<void> {
    // Le due richieste sono indipendenti: un errore su una non blocca l'altra.
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
