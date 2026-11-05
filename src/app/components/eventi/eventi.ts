import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Evento } from '../../interfaces/pocketbase';
import { PocketbaseService } from '../../services/pocketbase/pocketbase.service';

@Component({
  selector: 'app-eventi',
  imports: [DatePipe],
  templateUrl: './eventi.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Eventi implements OnInit {
  private readonly pocketbase = inject(PocketbaseService);

  protected readonly eventi = signal<Evento[]>([]);
  protected readonly caricamento = signal(true);
  protected readonly errore = signal(false);

  async ngOnInit(): Promise<void> {
    try {
      this.eventi.set(await this.pocketbase.getEventiInProgramma());
    } catch (error) {
      console.error('Errore nel caricamento degli eventi da PocketBase:', error);
      this.errore.set(true);
    } finally {
      this.caricamento.set(false);
    }
  }
}
