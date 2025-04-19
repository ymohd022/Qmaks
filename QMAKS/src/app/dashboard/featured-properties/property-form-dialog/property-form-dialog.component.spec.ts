import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyFormDialogComponent } from './property-form-dialog.component';

describe('PropertyFormDialogComponent', () => {
  let component: PropertyFormDialogComponent;
  let fixture: ComponentFixture<PropertyFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertyFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
