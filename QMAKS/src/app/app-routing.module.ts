import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactComponent } from './contact/contact.component';
import { GalleryComponent } from './gallery/gallery.component';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { HeroImagesComponent } from './dashboard/hero-images/hero-images.component';
import { FeaturedPropertiesComponent } from './dashboard/featured-properties/featured-properties.component';
import { ProjectsManagementComponent } from './projects-management/projects-management/projects-management.component';
import { GalleryManagementComponent } from './gallery/gallery-management/gallery-management.component';
import { PrivacyPolicyComponent } from './footer/privacy-policy/privacy-policy.component';
import { TermsOfUseComponent } from './footer/terms-of-use/terms-of-use.component';
import { SitemapComponent } from './footer/sitemap/sitemap.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'aboutus', component: AboutusComponent},
  {path: 'project', component: ProjectsComponent},
  {path: 'contact', component: ContactComponent},
  { path: "gallery", component: GalleryComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  { path: "terms-of-use", component: TermsOfUseComponent },
  { path: "sitemap", component: SitemapComponent },
  { path: "projects/:id", component: ProjectDetailComponent },
  { path: "login", component: LoginComponent, },
  {
    path: "admin",
    component: AdminLayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "home/hero-images", component: HeroImagesComponent },
      { path: "home/featured-properties", component: FeaturedPropertiesComponent },
      { path: "projects/details", component: ProjectsManagementComponent },
      { path: "gallery", component: GalleryManagementComponent },
      // Add other admin routes here
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top' // This ensures scrolling to the top on navigation
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
