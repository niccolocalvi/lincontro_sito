import { TestBed } from '@angular/core/testing';
import {
  EVENTI_MOCK,
  attendiCaricamento,
  providePocketbaseMock,
} from '../../testing/pocketbase.mock';
import { Eventi } from './eventi';

describe('Eventi', () => {
  it('mostra gli eventi in programma', async () => {
    TestBed.configureTestingModule({ providers: [providePocketbaseMock()] });
    const fixture = TestBed.createComponent(Eventi);
    await attendiCaricamento(fixture);

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('#lista-eventi li').length).toBe(1);
    expect(el.textContent).toContain('Lady and the Sax');
  });

  it('apre un pass alla volta, il primo aperto di default', async () => {
    const secondo = { ...EVENTI_MOCK[0], id: 'evento2', title: 'Aperiquiz' };
    TestBed.configureTestingModule({
      providers: [providePocketbaseMock({ eventi: [EVENTI_MOCK[0], secondo] })],
    });
    const fixture = TestBed.createComponent(Eventi);
    await attendiCaricamento(fixture);

    const el = fixture.nativeElement as HTMLElement;
    const bottoni = () => Array.from(el.querySelectorAll<HTMLButtonElement>('#lista-eventi button'));
    const espansi = () => bottoni().map((b) => b.getAttribute('aria-expanded'));

    expect(espansi()).toEqual(['true', 'false']);
    expect(el.querySelector('#pass-evento2')?.hasAttribute('inert')).toBe(true);

    bottoni()[1].click();
    fixture.detectChanges();

    expect(espansi()).toEqual(['false', 'true']);
    expect(el.querySelector('#pass-evento2')?.hasAttribute('inert')).toBe(false);
    expect(el.querySelector('#pass-evento2 a')?.getAttribute('href')).toContain(
      encodeURIComponent('"Aperiquiz"'),
    );
  });

  it('mostra un messaggio se non ci sono eventi', async () => {
    TestBed.configureTestingModule({ providers: [providePocketbaseMock({ eventi: [] })] });
    const fixture = TestBed.createComponent(Eventi);
    await attendiCaricamento(fixture);

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'non ci sono eventi in programma',
    );
  });
});
