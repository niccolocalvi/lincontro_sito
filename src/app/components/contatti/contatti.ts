import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { OrarioApertura } from '../../interfaces/pocketbase';
import { OraPipe } from '../../pipes/ora.pipe';
import { PocketbaseService } from '../../services/pocketbase/pocketbase.service';
import { isChiuso, orarioDelGiorno } from '../../utils/orari';

@Component({
  selector: 'app-contatti',
  imports: [OraPipe],
  templateUrl: './contatti.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contatti implements OnInit {
  private readonly pocketbase = inject(PocketbaseService);

  protected readonly orari = signal<OrarioApertura[]>([]);
  protected readonly caricamento = signal(true);
  protected readonly errore = signal(false);

  /** id del record di oggi, per evidenziarlo nella lista. */
  protected readonly idOggi = computed(() => orarioDelGiorno(this.orari())?.id);

  protected readonly isChiuso = isChiuso;

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
}
