import { Component } from '@angular/core';

@Component({
  selector: 'app-posizione',
  templateUrl: './posizione.html',
  styleUrls: ['./posizione.css']
})
export class Posizione {
  
  // Controlla se l'utente ha già dato il consenso in una sessione precedente
  mapConsent = localStorage.getItem('mapConsent') === 'true';

  acceptMap() {
    this.mapConsent = true;
    localStorage.setItem('mapConsent', 'true'); // Salva il consenso nel browser
  }

}