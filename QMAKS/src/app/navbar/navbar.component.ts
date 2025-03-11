import { Component, HostListener } from "@angular/core"
import { trigger, state, style, animate, transition } from "@angular/animations"
import { Router, NavigationEnd } from "@angular/router"
import { filter } from "rxjs/operators"

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  animations: [
    trigger("fadeInOut", [
      state(
        "void",
        style({
          opacity: 0,
        }),
      ),
      transition("void <=> *", animate("300ms ease-in-out")),
    ]),
    trigger("slideInOut", [
      state(
        "void",
        style({
          transform: "translateY(-20px)",
          opacity: 0,
        }),
      ),
      transition("void <=> *", animate("300ms ease-in-out")),
    ]),
    trigger("expandCollapse", [
      state(
        "collapsed",
        style({
          height: "0",
          overflow: "hidden",
          opacity: 0,
        }),
      ),
      state(
        "expanded",
        style({
          height: "*",
          opacity: 1,
        }),
      ),
      transition("collapsed <=> expanded", animate("300ms ease-in-out")),
    ]),
  ],
})
export class NavbarComponent {
  isScrolled = false
  isMobileMenuOpen = false
  isProjectsMenuOpen = false
  currentRoute = ""

  constructor(private router: Router) {
    // Subscribe to router events to track the current route
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects
    })
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
    if (this.isMobileMenuOpen) {
      this.isProjectsMenuOpen = false
    }
  }

  toggleProjectsMenu() {
    this.isProjectsMenuOpen = !this.isProjectsMenuOpen
  }

  // Helper method to check if a route is active
  isRouteActive(route: string): boolean {
    if (route === "/" && this.currentRoute === "/") {
      return true
    }
    return this.currentRoute.startsWith(route) && route !== "/"
  }
}

