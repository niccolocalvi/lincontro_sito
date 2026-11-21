import { TestBed } from '@angular/core/testing';
import { MENU_SITO_MOCK } from '../../testing/pocketbase.mock';
import { MenuSezioni } from './menu-sezioni';

const testoDi = (el: HTMLElement) => (el.textContent ?? '').replace(/\s+/g, ' ');

describe('MenuSezioni', () => {
  it('mostra sezioni e voci con prezzo, "da" e nota', async () => {
    const fixture = TestBed.createComponent(MenuSezioni);
    fixture.componentRef.setInput('sezioni', MENU_SITO_MOCK[0].sezioni);
    await fixture.whenStable();

    const testo = testoDi(fixture.nativeElement);
    expect(testo).toContain('Caffè 1,20 €');
    expect(testo).toContain('da 0,30 €');
    expect(testo).toContain('Biscotti · al kg 30,00 €');
    expect(testo).not.toContain('Sezione vuota');
  });

  it('usa price_label al posto del prezzo se valorizzato', async () => {
    const fixture = TestBed.createComponent(MenuSezioni);
    fixture.componentRef.setInput('sezioni', MENU_SITO_MOCK[1].sezioni);
    await fixture.whenStable();

    const testo = testoDi(fixture.nativeElement);
    expect(testo).toContain('Con gassosa 4,00 / 6,00 €');
    expect(testo).not.toContain('0,00 €');
  });
});
