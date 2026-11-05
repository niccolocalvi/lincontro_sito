import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

const CHIAVE_CONSENSO = 'mapConsent';

@Component({
  selector: 'app-posizione',
  templateUrl: './posizione.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Posizione {
  /** Consenso ai cookie di Google Maps, ricordato tra le visite. */
  protected readonly mapConsent = signal(leggiConsenso());

  protected acceptMap(): void {
    this.mapConsent.set(true);
    try {
      localStorage.setItem(CHIAVE_CONSENSO, 'true');
    } catch {
      // Storage non disponibile (es. navigazione privata): il consenso vale solo per questa visita.
    }
  }
}

function leggiConsenso(): boolean {
  try {
    return localStorage.getItem(CHIAVE_CONSENSO) === 'true';
  } catch {
    return false;
  }
}
