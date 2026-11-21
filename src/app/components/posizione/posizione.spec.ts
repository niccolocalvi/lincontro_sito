import { TestBed } from '@angular/core/testing';
import { Posizione } from './posizione';

describe('Posizione', () => {
  it('should create', async () => {
    const fixture = TestBed.createComponent(Posizione);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('il pulsante "Indicazioni stradali" apre il popup con le app di navigazione', async () => {
    const fixture = TestBed.createComponent(Posizione);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const popup = el.querySelector('dialog') as HTMLDialogElement;
    // jsdom non implementa showModal: lo simuliamo
    popup.showModal = () => popup.setAttribute('open', '');

    (el.querySelector('button[aria-haspopup="dialog"]') as HTMLButtonElement).click();

    expect(popup.open).toBe(true);
    const nomi = [...popup.querySelectorAll('li a')].map((a) => a.textContent?.trim());
    expect(nomi).toEqual(['Google Maps', 'Apple Mappe', 'Waze']);
  });
});
