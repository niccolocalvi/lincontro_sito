import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatiAttivitaService } from '../../services/dati-attivita/dati-attivita.service';

/** Pagina "Note legali": dati societari, condizioni d'uso del sito, copyright e crediti. */
@Component({
  selector: 'app-note-legali',
  templateUrl: './note-legali.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteLegali {
  private readonly datiAttivita = inject(DatiAttivitaService);

  protected readonly dati = this.datiAttivita.dati;
  protected readonly telefonoLink = this.datiAttivita.telefonoLink;
  protected readonly anno = new Date().getFullYear();
  /** Da aggiornare a ogni modifica sostanziale del testo. */
  protected readonly ultimoAggiornamento = '21 novembre 2026';
}
