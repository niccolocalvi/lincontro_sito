import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatiAttivitaService } from '../../services/dati-attivita/dati-attivita.service';

/** Informativa privacy (art. 13 GDPR) e cookie policy. */
@Component({
  selector: 'app-privacy-policy',
  imports: [RouterLink],
  templateUrl: './privacy-policy.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicy {
  protected readonly dati = inject(DatiAttivitaService).dati;
  /** Da aggiornare a ogni modifica sostanziale del testo o dei servizi usati dal sito. */
  protected readonly ultimoAggiornamento = '21 novembre 2026';
}
