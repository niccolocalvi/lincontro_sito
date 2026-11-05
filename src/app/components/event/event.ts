import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PocketbaseService } from '../../services/pocketbase/pocketbase.service';
import { Evento } from '../../interfaces/pocketbase';

@Component({
  selector: 'app-event',
  imports: [DatePipe],
  templateUrl: './event.html',
  styleUrl: './event.css',
})
export class Event implements OnInit {
  private readonly pocketbase = inject(PocketbaseService);

  readonly eventi = signal<Evento[]>([]);
  readonly caricamento = signal(true);
  readonly errore = signal(false);

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
