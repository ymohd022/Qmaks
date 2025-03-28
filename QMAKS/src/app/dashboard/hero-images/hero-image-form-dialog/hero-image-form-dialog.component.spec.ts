import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroImageFormDialogComponent } from './hero-image-form-dialog.component';

describe('HeroImageFormDialogComponent', () => {
  let component: HeroImageFormDialogComponent;
  let fixture: ComponentFixture<HeroImageFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeroImageFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroImageFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
