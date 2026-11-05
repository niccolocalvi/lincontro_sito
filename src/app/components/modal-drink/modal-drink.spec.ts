import { TestBed } from '@angular/core/testing';
import { ModalDrink } from './modal-drink';

describe('ModalDrink', () => {
  it('should create', async () => {
    const fixture = TestBed.createComponent(ModalDrink);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
