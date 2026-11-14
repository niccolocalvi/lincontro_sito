import { Injectable } from '@angular/core';

/** Dati anagrafici statici dell'attività. Gli orari arrivano da PocketBase. */
export interface DatiAttivita {
  via: string;
  civico: string;
  citta: string;
  cap: string;
  provincia: string;
  telefono: string;
  email: string;
  instagram: string;
  facebook: string;
  partitaIva: string;
  rea: string;
  capitaleSociale: string;
  nomeLegale: string;
  nomeCommerciale: string;
  descrizione: string;
  pec: string;
  sitoWeb: string;
}

@Injectable({
  providedIn: 'root',
})
export class DatiAttivitaService {
  readonly dati: Readonly<DatiAttivita> = {
    via: 'Largo Claudio Monteverdi',
    civico: '19',
    citta: 'Valcanneto',
    cap: '00052',
    provincia: 'RM',
    telefono: '+39 334 387 4529',
    email: 'info@incontro.it',
    instagram: 'https://www.instagram.com/incontrovalcanneto/',
    facebook: 'https://www.facebook.com/incontrovalcanneto',
    partitaIva: '12345678901',
    rea: 'RM-123456',
    capitaleSociale: '10.000,00 €',
    nomeLegale: 'Incontro S.r.l.',
    nomeCommerciale: "L'Incontro",
    descrizione:
      "Incontro è un ristorante accogliente e moderno situato a Valcanneto, che offre una cucina italiana autentica e piatti creativi preparati con ingredienti freschi e di alta qualità. Il nostro obiettivo è creare un'esperienza culinaria indimenticabile per i nostri ospiti, combinando sapori tradizionali con un tocco contemporaneo.",
    pec: 'incontro@pec.it',
    sitoWeb: 'https://lincontrobar.it',
  };

  /** Numero di telefono senza spazi, per i link `tel:`. */
  get telefonoLink(): string {
    return this.dati.telefono.replace(/\s/g, '');
  }
}
