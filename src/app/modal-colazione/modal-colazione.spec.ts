import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalColazione } from './modal-colazione';

describe('ModalColazione', () => {
  let component: ModalColazione;
  let fixture: ComponentFixture<ModalColazione>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalColazione],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalColazione);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
