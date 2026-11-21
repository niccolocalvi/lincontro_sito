import { TestBed } from '@angular/core/testing';
import { NoteLegali } from './note-legali';

describe('NoteLegali', () => {
  it('mostra i dati societari obbligatori', async () => {
    const fixture = TestBed.createComponent(NoteLegali);
    await fixture.whenStable();
    const testo = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(testo).toContain('Federico S.r.l.');
    expect(testo).toContain('17376871004');
    expect(testo).toContain('10.000,00 €');
    expect(testo).toContain('federico1987iafrate@pec.it');
  });
});
