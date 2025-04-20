import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryUploadDialogComponent } from './gallery-upload-dialog.component';

describe('GalleryUploadDialogComponent', () => {
  let component: GalleryUploadDialogComponent;
  let fixture: ComponentFixture<GalleryUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GalleryUploadDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
