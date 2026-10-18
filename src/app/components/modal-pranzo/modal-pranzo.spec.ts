import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPranzo } from './modal-pranzo';

describe('ModalPranzo', () => {
  let component: ModalPranzo;
  let fixture: ComponentFixture<ModalPranzo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPranzo],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalPranzo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
