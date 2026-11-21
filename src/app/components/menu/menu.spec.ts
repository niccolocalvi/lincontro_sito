import { TestBed } from '@angular/core/testing';
import { attendiCaricamento, providePocketbaseMock } from '../../testing/pocketbase.mock';
import { Menu } from './menu';

const testoDi = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ');

describe('Menu', () => {
  it('crea una card con modale per ogni menu del sito e le combo', async () => {
    TestBed.configureTestingModule({ providers: [providePocketbaseMock()] });
    const fixture = TestBed.createComponent(Menu);
    await attendiCaricamento(fixture);

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('app-menu-card').length).toBe(2);

    const colazione = testoDi(el.querySelector('#modale-colazione'));
    const drink = testoDi(el.querySelector('#modale-drink'));
    expect(colazione).toContain('Colazione & Caffetteria');
    expect(colazione).toContain('Caffè');
    expect(colazione).not.toContain('Con gassosa');
    expect(drink).toContain('Fallo Premium');
    expect(drink).toContain('+4,00 €');
    expect(drink).toContain('Con gassosa');

    const testo = testoDi(el);
    expect(testo).toContain('Dalle 5:30');
    expect(testo).toContain('Primo o Secondo');
    expect(testo).toContain('9,00 €');
  });

  it('mostra un messaggio se non ci sono menu', async () => {
    TestBed.configureTestingModule({
      providers: [providePocketbaseMock({ menu: [], combo: [] })],
    });
    const fixture = TestBed.createComponent(Menu);
    await attendiCaricamento(fixture);

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Menu non disponibile');
    expect(el.querySelector('app-menu-card')).toBeNull();
  });
});
