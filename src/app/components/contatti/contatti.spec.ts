import { TestBed } from '@angular/core/testing';
import { PocketbaseService } from '../../services/pocketbase/pocketbase.service';
import { attendiCaricamento, providePocketbaseMock } from '../../testing/pocketbase.mock';
import { Contatti } from './contatti';

describe('Contatti', () => {
  it('mostra gli orari della settimana ed evidenzia oggi', async () => {
    TestBed.configureTestingModule({ providers: [providePocketbaseMock()] });
    const fixture = TestBed.createComponent(Contatti);
    await attendiCaricamento(fixture);

    const el = fixture.nativeElement as HTMLElement;
    const righe = el.querySelectorAll('#info-e-contatti li');
    expect(righe.length).toBe(7);
    expect(righe[0].textContent).toContain('05:30 – 20:00');
    expect(el.querySelectorAll('li[aria-current="date"]').length).toBe(1);
  });

  it('mostra un messaggio se il DB non risponde', async () => {
    TestBed.configureTestingModule({ providers: [providePocketbaseMock()] });
    TestBed.inject(PocketbaseService).getOrari = () => Promise.reject(new Error('offline'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const fixture = TestBed.createComponent(Contatti);
    await attendiCaricamento(fixture);

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Orari non disponibili');
  });
});
