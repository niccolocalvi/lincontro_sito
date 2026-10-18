import { Component } from '@angular/core';
import { Dati_attivitaService } from '../../services/dati_attivita/dati_attivita.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

  dataAttivita: any;

  constructor(private datiAttivitaService: Dati_attivitaService) { }

  getdatiAttivita() {
    return this.datiAttivitaService.datiAttivita;
  }
}
