/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Dati_attivitaService } from '../dati_attivita.service';

describe('Service: Dati_attivita', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Dati_attivitaService]
    });
  });

  it('should ...', inject([Dati_attivitaService], (service: Dati_attivitaService) => {
    expect(service).toBeTruthy();
  }));
});
