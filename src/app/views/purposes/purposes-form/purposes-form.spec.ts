import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurposesForm } from './purposes-form';

describe('PurposesForm', () => {
  let component: PurposesForm;
  let fixture: ComponentFixture<PurposesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurposesForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurposesForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
