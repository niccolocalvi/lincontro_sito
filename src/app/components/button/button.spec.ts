import { TestBed } from '@angular/core/testing';
import { Button } from './button';

describe('Button', () => {
  it('mostra testo, link e classi passati come input', async () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentRef.setInput('text', 'Prenota');
    fixture.componentRef.setInput('href', '#menu');
    fixture.componentRef.setInput('customClass', 'w-full');
    await fixture.whenStable();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.textContent?.trim()).toBe('Prenota');
    expect(link.getAttribute('href')).toBe('#menu');
    expect(link.classList).toContain('w-full');
    expect(link.classList).toContain('bg-primary');
  });
});
