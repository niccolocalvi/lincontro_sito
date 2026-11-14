import { TestBed } from '@angular/core/testing';
import { attendiCaricamento, providePocketbaseMock } from '../../testing/pocketbase.mock';
import { Hero } from './hero';

describe('Hero', () => {
  it("mostra l'orario di oggi e il prossimo evento", async () => {
    TestBed.configureTestingModule({ providers: [providePocketbaseMock()] });
    const fixture = TestBed.createComponent(Hero);
    await attendiCaricamento(fixture);

    const testo = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(testo).toContain('05:30 – 20:00');
    expect(testo).toContain('Lady and the Sax');
  });
});
