import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideHttpClient } from "@angular/common/http";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { MatStepperModule } from "@angular/material/stepper";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { NgChartsModule } from "ng2-charts";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { DragDropModule } from "@angular/cdk/drag-drop";

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { matDatepickerAnimations, MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from "@angular/material/list"
import { MatTableModule } from "@angular/material/table"


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { CountUpDirective } from "./home/count-up.directive";
import { AboutusComponent } from './aboutus/aboutus.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ContactComponent } from './contact/contact.component';

import { GalleryComponent } from './gallery/gallery.component';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { HeroImagesComponent } from './dashboard/hero-images/hero-images.component';
import { HeroImageFormDialogComponent } from './dashboard/hero-images/hero-image-form-dialog/hero-image-form-dialog.component'
import { ConfirmDialogComponent } from "./dashboard/hero-images/hero-image-form-dialog/confirm-dialog.component";
import { FeaturedPropertiesComponent } from './dashboard/featured-properties/featured-properties.component';
import { PropertyFormDialogComponent } from './dashboard/featured-properties/property-form-dialog/property-form-dialog.component';
import { BrochureUploadDialogComponent } from './dashboard/featured-properties/brochure-upload-dialog/brochure-upload-dialog.component';
import { ProjectsManagementComponent } from './projects-management/projects-management/projects-management.component';
import { ProjectFormDialogComponent } from './projects-management/project-form-dialog/project-form-dialog.component';
import { ProjectMediaDialogComponent } from './projects-management/project-media-dialog/project-media-dialog.component';
import { GalleryUploadDialogComponent } from './gallery/gallery-upload-dialog/gallery-upload-dialog.component';
import { GalleryManagementComponent } from './gallery/gallery-management/gallery-management.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    CountUpDirective,
    AboutusComponent,
    ProjectsComponent,
    ProjectDetailComponent,
    ContactComponent,
    GalleryComponent,
    LoginComponent,
    AdminLayoutComponent,
    DashboardComponent,
    SplashScreenComponent,
    HeroImagesComponent,
    HeroImageFormDialogComponent,
    ConfirmDialogComponent,
    FeaturedPropertiesComponent,
    PropertyFormDialogComponent,
    BrochureUploadDialogComponent,
    ProjectsManagementComponent,
    ProjectFormDialogComponent,
    ProjectMediaDialogComponent,
    GalleryUploadDialogComponent,
    GalleryManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatDividerModule,
    MatRippleModule,
    MatTabsModule,
    MatSnackBarModule,
    RouterModule,
    MatStepperModule,
    MatProgressBarModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatDialogModule,
    MatGridListModule,
    MatSidenavModule,
    MatTooltipModule,
    MatListModule,
    NgChartsModule,
    MatTableModule,
    MatSlideToggleModule,
    DragDropModule

    
    
  ],
  providers: [
    provideHttpClient(),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
