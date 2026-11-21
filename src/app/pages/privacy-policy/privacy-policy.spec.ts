import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PrivacyPolicy } from './privacy-policy';

describe('PrivacyPolicy', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('mostra il titolare e la sezione cookie', async () => {
    const fixture = TestBed.createComponent(PrivacyPolicy);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Federico S.r.l.');
    expect(el.querySelector('#cookie')).toBeTruthy();
  });
});
