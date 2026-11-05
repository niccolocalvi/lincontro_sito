import { TestBed } from '@angular/core/testing';
import { Posizione } from './posizione';

describe('Posizione', () => {
  it('should create', async () => {
    const fixture = TestBed.createComponent(Posizione);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
