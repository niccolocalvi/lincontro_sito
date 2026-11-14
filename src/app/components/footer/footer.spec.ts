import { TestBed } from '@angular/core/testing';
import { Footer } from './footer';

describe('Footer', () => {
  it('mostra il telefono con link tel: senza spazi', async () => {
    const fixture = TestBed.createComponent(Footer);
    await fixture.whenStable();
    const link = (fixture.nativeElement as HTMLElement).querySelector('a[href^="tel:"]');
    expect(link?.getAttribute('href')).toBe('tel:+393343874529');
  });
});
