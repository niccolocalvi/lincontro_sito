import { TestBed } from '@angular/core/testing';
import { attendiCaricamento, providePocketbaseMock } from '../../testing/pocketbase.mock';
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

  it('mostra un messaggio se non ci sono eventi', async () => {
    TestBed.configureTestingModule({ providers: [providePocketbaseMock({ eventi: [] })] });
    const fixture = TestBed.createComponent(Eventi);
    await attendiCaricamento(fixture);

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'non ci sono eventi in programma',
    );
  });
});
