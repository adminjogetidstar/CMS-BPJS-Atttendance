import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopLayout } from './desktop-layout';

describe('DesktopLayout', () => {
  let component: DesktopLayout;
  let fixture: ComponentFixture<DesktopLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
