import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Purposes } from './purposes';

describe('Purposes', () => {
  let component: Purposes;
  let fixture: ComponentFixture<Purposes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Purposes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Purposes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
