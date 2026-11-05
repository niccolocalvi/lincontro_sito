import { TestBed } from '@angular/core/testing';
import { DatiAttivitaService } from './dati-attivita.service';

describe('DatiAttivitaService', () => {
  it('fornisce il telefono senza spazi per i link', () => {
    const service = TestBed.inject(DatiAttivitaService);
    expect(service.telefonoLink).toBe('+393343874529');
  });
});
