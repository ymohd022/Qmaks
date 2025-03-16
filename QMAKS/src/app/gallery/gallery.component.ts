import { Component, type OnInit } from "@angular/core"
import { trigger, transition, style, animate, query, stagger } from "@angular/animations"

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
  animations: [
    trigger("fadeIn", [
      transition(":enter", [style({ opacity: 0 }), animate("0.5s ease-in-out", style({ opacity: 1 }))]),
    ]),
    trigger("staggerAnimation", [
      transition("* => *", [
        query(
          ":enter",
          [
            style({ opacity: 0, transform: "translateY(20px)" }),
            stagger("100ms", [animate("0.5s ease-out", style({ opacity: 1, transform: "translateY(0)" }))]),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class GalleryComponent implements OnInit {
  // All projects data
  projects = [
    {
      id: 1,
      name: "Royal Heights",
      type: "Residential",
      subType: "Apartment",
      status: "Completed",
      location: "Downtown",
      year: 2022,
      images: [
        { url: "/HASEEB RESIDENCY.png", type: "image", caption: "Building Exterior" },
        { url: "/lobby.jpg", type: "image", caption: "Lobby" },
        { url: "/apartment-inter.jpg", type: "image", caption: "Apartment Interior" },
        { url: "/property.jpg", type: "video", caption: "Property Tour" },
      ],
      description: "Luxury apartments with premium amenities in the heart of the city.",
    },
    {
      id: 2,
      name: "Green Valley Villas",
      type: "Residential",
      subType: "Villa",
      status: "Completed",
      location: "Suburban Area",
      year: 2021,
      images: [
        { url: "/placeholder.svg", type: "image", caption: "Villa Exterior" },
        { url: "/placeholder.svg", type: "image", caption: "Garden" },
        { url: "/placeholder.svg", type: "image", caption: "Living Room" },
        { url: "/placeholder.svg", type: "video", caption: "Property Walkthrough" },
      ],
      description: "Eco-friendly villas with spacious gardens and sustainable features.",
    },
    {
      id: 3,
      name: "Skyline Towers",
      type: "Residential",
      subType: "High-rise",
      status: "Ongoing",
      location: "Business District",
      year: 2023,
      images: [
        { url: "/placeholder.svg", type: "image", caption: "Tower Rendering" },
        { url: "/placeholder.svg", type: "image", caption: "Construction Progress" },
        { url: "/placeholder.svg", type: "image", caption: "Sample Apartment" },
        { url: "/placeholder.svg", type: "video", caption: "3D Walkthrough" },
      ],
      description: "Modern apartments with panoramic city views and smart home technology.",
    },
    {
      id: 4,
      name: "Riverside Residences",
      type: "Residential",
      subType: "Condo",
      status: "Upcoming",
      location: "Waterfront",
      year: 2024,
      images: [
        { url: "/placeholder.svg", type: "image", caption: "Building Concept" },
        { url: "/placeholder.svg", type: "image", caption: "Location View" },
        { url: "/placeholder.svg", type: "image", caption: "Interior Concept" },
        { url: "/placeholder.svg", type: "video", caption: "Project Preview" },
      ],
      description: "Exclusive waterfront condos with private balconies and premium finishes.",
    },
    {
      id: 5,
      name: "Central Business Plaza",
      type: "Commercial",
      subType: "Office",
      status: "Completed",
      location: "Downtown",
      year: 2020,
      images: [
        { url: "/placeholder.svg", type: "image", caption: "Building Exterior" },
        { url: "/placeholder.svg", type: "image", caption: "Lobby" },
        { url: "/placeholder.svg", type: "image", caption: "Office Space" },
        { url: "/placeholder.svg", type: "video", caption: "Facility Tour" },
      ],
      description: "Modern office complex with state-of-the-art facilities and prime location.",
    },
    {
      id: 6,
      name: "Sunset Mall",
      type: "Commercial",
      subType: "Retail",
      status: "Completed",
      location: "Suburban Area",
      year: 2019,
      images: [
        { url: "/placeholder.svg", type: "image", caption: "Mall Exterior" },
        { url: "/placeholder.svg", type: "image", caption: "Main Atrium" },
        { url: "/placeholder.svg", type: "image", caption: "Food Court" },
        { url: "/placeholder.svg", type: "video", caption: "Mall Tour" },
      ],
      description: "Shopping destination with diverse retail options and entertainment facilities.",
    },
    {
      id: 7,
      name: "Tech Innovation Hub",
      type: "Commercial",
      subType: "Mixed-use",
      status: "Ongoing",
      location: "Business District",
      year: 2023,
      images: [
        { url: "/placeholder.svg", type: "image", caption: "Building Rendering" },
        { url: "/placeholder.svg", type: "image", caption: "Construction Progress" },
        { url: "/placeholder.svg", type: "image", caption: "Interior Concept" },
        { url: "/placeholder.svg", type: "video", caption: "Project Overview" },
      ],
      description: "Mixed-use development focused on technology companies and startups.",
    },
    {
      id: 8,
      name: "Harmony Industrial Park",
      type: "Industrial",
      subType: "Warehouse",
      status: "Completed",
      location: "Industrial Zone",
      year: 2021,
      images: [
        { url: "/placeholder.svg", type: "image", caption: "Aerial View" },
        { url: "/placeholder.svg", type: "image", caption: "Warehouse Exterior" },
        { url: "/placeholder.svg", type: "image", caption: "Interior Space" },
        { url: "/placeholder.svg", type: "video", caption: "Facility Overview" },
      ],
      description: "Modern industrial complex with efficient logistics infrastructure.",
    },
    {
      id: 9,
      name: "Greenfield Manufacturing Plant",
      type: "Industrial",
      subType: "Factory",
      status: "Ongoing",
      location: "Industrial Zone",
      year: 2023,
      images: [
        { url: "/placeholder.svg", type: "image", caption: "Construction Site" },
        { url: "/placeholder.svg", type: "image", caption: "Building Progress" },
        { url: "/placeholder.svg", type: "image", caption: "Facility Rendering" },
        { url: "/placeholder.svg", type: "video", caption: "Project Timeline" },
      ],
      description: "State-of-the-art manufacturing facility with sustainable design elements.",
    },
  ]

  // Filter options
  projectTypes = [
    { value: "all", label: "All Types" },
    { value: "Residential", label: "Residential" },
    { value: "Commercial", label: "Commercial" },
    { value: "Industrial", label: "Industrial" },
  ]

  projectStatuses = [
    { value: "all", label: "All Statuses" },
    { value: "Completed", label: "Completed" },
    { value: "Ongoing", label: "Ongoing" },
    { value: "Upcoming", label: "Upcoming" },
  ]

  projectLocations = [
    { value: "all", label: "All Locations" },
    { value: "Downtown", label: "Downtown" },
    { value: "Suburban Area", label: "Suburban Area" },
    { value: "Business District", label: "Business District" },
    { value: "Waterfront", label: "Waterfront" },
    { value: "Industrial Zone", label: "Industrial Zone" },
  ]

  // Active filters
  activeFilters = {
    type: "all",
    status: "all",
    location: "all",
  }

  // Filtered projects
  filteredProjects = [...this.projects]

  // Selected project for lightbox
  selectedProject: any = null
  selectedImageIndex = 0
  lightboxOpen = false

  constructor() {}

  ngOnInit(): void {
    // Initialize with all projects
    this.applyFilters()
  }

  // Apply filters
  applyFilters(): void {
    this.filteredProjects = this.projects.filter((project) => {
      // Check if project matches all active filters
      const matchesType = this.activeFilters.type === "all" || project.type === this.activeFilters.type
      const matchesStatus = this.activeFilters.status === "all" || project.status === this.activeFilters.status
      const matchesLocation = this.activeFilters.location === "all" || project.location === this.activeFilters.location

      return matchesType && matchesStatus && matchesLocation
    })
  }

  // Update filter
  updateFilter(filterType: string, value: string): void {
    this.activeFilters[filterType as keyof typeof this.activeFilters] = value
    this.applyFilters()
  }

  // Open lightbox
  openLightbox(project: any, index: number): void {
    this.selectedProject = project
    this.selectedImageIndex = index
    this.lightboxOpen = true
    document.body.classList.add("overflow-hidden")
  }

  // Close lightbox
  closeLightbox(): void {
    this.lightboxOpen = false
    document.body.classList.remove("overflow-hidden")
  }

  // Navigate to next image
  nextImage(): void {
    if (this.selectedProject) {
      this.selectedImageIndex = (this.selectedImageIndex + 1) % this.selectedProject.images.length
    }
  }

  // Navigate to previous image
  prevImage(): void {
    if (this.selectedProject) {
      this.selectedImageIndex =
        (this.selectedImageIndex - 1 + this.selectedProject.images.length) % this.selectedProject.images.length
    }
  }

  // Get status class
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case "completed":
        return "completed"
      case "ongoing":
        return "ongoing"
      case "upcoming":
        return "upcoming"
      default:
        return ""
    }
  }
}