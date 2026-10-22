import { Component } from '@angular/core';
import { Dati_attivitaService } from '../../services/dati_attivita/dati_attivita.service';
import { CommonModule } from '@angular/common';
import PocketBase from 'pocketbase';

@Component({
  selector: 'app-contatti',
  imports: [CommonModule],
  templateUrl: './contatti.html',
  styleUrl: './contatti.css',
})
export class Contatti {
  orari: any = null;
  pb = new PocketBase('https://api.lincontrobar.it');

  constructor(private datiAttivitaService: Dati_attivitaService) {}

  async ngOnInit(): Promise<void> {
    try {
      const records = await this.pb.collection('opening_hours').getFullList({
        sort: 'legacy_id',
      });
      this.orari = records;
    } catch (error) {
      console.error('Errore PocketBase:', error);
    }
  }

  formattaOrari(orari: string): string {
    if (!orari || orari.length === 0) {
      return 'Nessun orario disponibile';
    }

    console.log(orari);

    const oraMinuti = orari.substring(0, 5);

    return oraMinuti;
  }
}
