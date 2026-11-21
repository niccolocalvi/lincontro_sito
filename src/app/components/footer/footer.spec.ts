import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Footer } from './footer';

describe('Footer', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('mostra il telefono con link tel: senza spazi', async () => {
    const fixture = TestBed.createComponent(Footer);
    await fixture.whenStable();
    const link = (fixture.nativeElement as HTMLElement).querySelector('a[href^="tel:"]');
    expect(link?.getAttribute('href')).toBe('tel:+393343874529');
  });

  it('mostra i dati societari e il link alle note legali', async () => {
    const fixture = TestBed.createComponent(Footer);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('P. IVA 17376871004');
    expect(el.textContent).toContain('REA RM-1714351');
    expect(el.textContent).toContain('Capitale sociale 10.000,00 € i.v.');
    expect(el.querySelector('a[href="mailto:federico1987iafrate@pec.it"]')).toBeTruthy();
    expect(el.querySelector('a[href="/note-legali"]')).toBeTruthy();
    expect(el.querySelector('a[href="/privacy-policy"]')).toBeTruthy();
  });
});
