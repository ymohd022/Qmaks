import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrochureUploadDialogComponent } from './brochure-upload-dialog.component';

describe('BrochureUploadDialogComponent', () => {
  let component: BrochureUploadDialogComponent;
  let fixture: ComponentFixture<BrochureUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrochureUploadDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrochureUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
