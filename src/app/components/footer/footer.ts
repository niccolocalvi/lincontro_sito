import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatiAttivitaService } from '../../services/dati-attivita/dati-attivita.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  private readonly datiAttivita = inject(DatiAttivitaService);

  protected readonly dati = this.datiAttivita.dati;
  protected readonly telefonoLink = this.datiAttivita.telefonoLink;
  protected readonly anno = new Date().getFullYear();
}
