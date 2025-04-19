import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { Router } from "@angular/router";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  @ViewChild("drawer") drawer!: MatSidenav;

  isHandset$: Observable<boolean>;

  menuItems = [
    {
      name: "Dashboard Overview",
      icon: "dashboard",
      route: "/admin/dashboard",
      expanded: false,
      children: [],
    },
    {
      name: "Home Page Management",
      icon: "home",
      route: null,
      expanded: false,
      children: [
        { name: "Hero Images", route: "/admin/home/hero-images", icon: "image" },
        { name: "Featured Properties", route: "/admin/home/featured-properties", icon: "business" },
      ],
    },
    {
      name: "Projects Management",
      icon: "business",
      route: null,
      expanded: false,
      children: [
        { name: "Project Details", route: "/admin/projects/details", icon: "description" },
        { name: "Project Media", route: "/admin/projects/media", icon: "perm_media" },
      ],
    },
    {
      name: "Gallery Management",
      icon: "photo_library",
      route: "/admin/gallery",
      expanded: false,
      children: [],
    },
    {
      name: "Brochure Management",
      icon: "picture_as_pdf",
      route: "/admin/brochures",
      expanded: false,
      children: [],
    },
  ];

  currentUser: any = null;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      shareReplay(),
    );
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  toggleMenu(item: any): void {
    if (item.children && item.children.length > 0) {
      item.expanded = !item.expanded;
    } else if (item.route) {
      this.router.navigate([item.route]);
      this.isHandset$.subscribe((isHandset) => {
        if (isHandset) {
          this.drawer.close();
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  isActive(route: string | null): boolean {
    if (!route) return false;
    return this.router.url === route || this.router.url.startsWith(route);
  }

  isChildActive(item: any): boolean {
    if (!item.children || item.children.length === 0) return false;
    return item.children.some(
      (child: any) => this.router.url === child.route || this.router.url.startsWith(child.route),
    );
  }
}