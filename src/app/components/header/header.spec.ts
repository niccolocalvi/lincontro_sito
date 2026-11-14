import { TestBed } from '@angular/core/testing';
import { Header } from './header';

describe('Header', () => {
  it('apre e chiude il menu mobile', async () => {
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const toggle = el.querySelector('button[aria-label="Menu"]') as HTMLButtonElement;

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(el.querySelector('header > div.fixed')).toBeTruthy();
  });
});
