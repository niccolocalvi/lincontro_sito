import { TestBed } from '@angular/core/testing';
import { ModalCaffetteria } from './modal-caffetteria';

describe('ModalCaffetteria', () => {
  it('should create', async () => {
    const fixture = TestBed.createComponent(ModalCaffetteria);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
