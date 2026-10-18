import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Dati_attivitaService {

constructor() { }

datiAttivita = {
  via: 'Largo Claudio Monteverdi',
  civico: '19',
  citta: 'Valcanneto',
  cap: '00052',
  provincia: 'RM',
  telefono: '+39 334 387 4529',
  email: 'info@incontro.it',
  instagram: 'https://www.instagram.com/incontrovalcanneto/',
  facebook: 'https://www.facebook.com/incontrovalcanneto',
  orari: [
    { giorno: 'Lunedì', apertura: 'Chiuso', chiusura: '' },
    { giorno: 'Martedì', apertura: '19:00', chiusura: '23:00' },
    { giorno: 'Mercoledì', apertura: '19:00', chiusura: '23:00' },
    { giorno: 'Giovedì', apertura: '19:00', chiusura: '23:00' },
    { giorno: 'Venerdì', apertura: '19:00', chiusura: '23:00' },
    { giorno: 'Sabato', apertura: '19:00', chiusura: '23:00' },
    { giorno: 'Domenica', apertura: '19:00', chiusura: '23:00' }
  ],
  partitaIva: '12345678901',
  rea: 'RM-123456',
  capitaleSociale: '10.000,00 €',
  nomeLegale: 'Incontro S.r.l.',
  nomeCommerciale: 'L\'Incontro',
  descrizione: 'Incontro è un ristorante accogliente e moderno situato a Valcanneto, che offre una cucina italiana autentica e piatti creativi preparati con ingredienti freschi e di alta qualità. Il nostro obiettivo è creare un\'esperienza culinaria indimenticabile per i nostri ospiti, combinando sapori tradizionali con un tocco contemporaneo.',
  pec: 'incontro@pec.it',
  sitoWeb: 'https://lincontrobar.it',
}

}
