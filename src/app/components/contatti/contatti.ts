import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { PocketbaseService } from '../../services/pocketbase/pocketbase.service';
import { OrarioApertura } from '../../interfaces/pocketbase';
import { formattaOra, isChiuso, orarioDelGiorno } from '../../utils/orari';

@Component({
  selector: 'app-contatti',
  imports: [],
  templateUrl: './contatti.html',
  styleUrl: './contatti.css',
})
export class Contatti implements OnInit {
  private readonly pocketbase = inject(PocketbaseService);

  // Signal: l'app è zoneless, un campo normale non aggiornerebbe la vista dopo l'await.
  readonly orari = signal<OrarioApertura[]>([]);
  readonly caricamento = signal(true);
  readonly errore = signal(false);

  /** id del record di oggi, per evidenziarlo nella lista. */
  readonly idOggi = computed(() => orarioDelGiorno(this.orari())?.id);

  async ngOnInit(): Promise<void> {
    try {
      this.orari.set(await this.pocketbase.getOrari());
    } catch (error) {
      console.error('Errore nel caricamento degli orari da PocketBase:', error);
      this.errore.set(true);
    } finally {
      this.caricamento.set(false);
    }
  }

  readonly formattaOra = formattaOra;
  readonly isChiuso = isChiuso;
}
