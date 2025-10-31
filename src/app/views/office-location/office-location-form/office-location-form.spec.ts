import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeLocationForm } from './office-location-form';

describe('OfficeLocationForm', () => {
  let component: OfficeLocationForm;
  let fixture: ComponentFixture<OfficeLocationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficeLocationForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficeLocationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
