import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Posizione } from './posizione';

describe('Posizione', () => {
  let component: Posizione;
  let fixture: ComponentFixture<Posizione>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Posizione],
    }).compileComponents();

    fixture = TestBed.createComponent(Posizione);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
