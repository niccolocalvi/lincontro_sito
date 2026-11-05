import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatiAttivitaService } from '../../services/dati-attivita/dati-attivita.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  private readonly datiAttivita = inject(DatiAttivitaService);

  protected readonly dati = this.datiAttivita.dati;
  protected readonly telefonoLink = this.datiAttivita.telefonoLink;
}
