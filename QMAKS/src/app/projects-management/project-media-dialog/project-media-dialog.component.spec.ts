import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMediaDialogComponent } from './project-media-dialog.component';

describe('ProjectMediaDialogComponent', () => {
  let component: ProjectMediaDialogComponent;
  let fixture: ComponentFixture<ProjectMediaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectMediaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectMediaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
