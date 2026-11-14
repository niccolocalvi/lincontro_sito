import { TestBed } from '@angular/core/testing';
import { About } from './about';

describe('About', () => {
  it('should create', async () => {
    const fixture = TestBed.createComponent(About);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
