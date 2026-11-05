import { TestBed } from '@angular/core/testing';
import { Menu } from './menu';

describe('Menu', () => {
  it('should create', async () => {
    const fixture = TestBed.createComponent(Menu);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
