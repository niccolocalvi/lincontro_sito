import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTaglieri } from './modal-taglieri';

describe('ModalTaglieri', () => {
  let component: ModalTaglieri;
  let fixture: ComponentFixture<ModalTaglieri>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTaglieri],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalTaglieri);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
