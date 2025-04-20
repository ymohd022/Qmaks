import { Component,  OnInit } from "@angular/core"
import { trigger, transition, style, animate, query, stagger } from "@angular/animations"
import  { ProjectService } from "../services/project.service"
import  { GalleryService, GalleryImage } from "../services/gallery.service"
import { forkJoin } from "rxjs"

interface GalleryProject {
  id: number
  name: string
  type: string
  subType: string
  status: string
  location: string
  year: number | string
  description: string
  images: {
    url: string
    type: string
    caption: string
  }[]
}

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrl: "./gallery.component.css",
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
  // Projects data
  projects: GalleryProject[] = []
  isLoading = true

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
  filteredProjects: GalleryProject[] = []

  // Selected project for lightbox
  selectedProject: GalleryProject | null = null
  selectedImageIndex = 0
  lightboxOpen = false

  constructor(
    private projectService: ProjectService,
    private galleryService: GalleryService,
  ) {}

  ngOnInit(): void {
    this.loadProjects()
  }

  // Load projects and their gallery images
  loadProjects(): void {
    this.isLoading = true

    this.projectService.getProjects().subscribe({
      next: (projects) => {
        // Create an array of observables for each project's gallery images
        const galleryRequests = projects.map((project) => this.galleryService.getGalleryImagesByProject(project.id))

        // If there are projects, fetch their gallery images
        if (projects.length > 0) {
          forkJoin(galleryRequests).subscribe({
            next: (galleryResults) => {
              // Map projects with their gallery images
              this.projects = projects.map((project, index) => {
                const projectImages = galleryResults[index]

                // Extract year from completion date if available
                const year = project.completion
                  ? new Date(project.completion).getFullYear()
                  : project.createdAt
                    ? new Date(project.createdAt).getFullYear()
                    : "N/A"

                // Map to gallery project format
                return {
                  id: project.id,
                  name: project.name,
                  type: project.type,
                  subType: project.type.includes("-") ? project.type.split("-")[1].trim() : "",
                  status: project.status,
                  location: project.location,
                  year: year,
                  description: project.description,
                  images: this.mapGalleryImages(projectImages, project),
                }
              })

              // Filter out projects with no images
              this.projects = this.projects.filter((project) => project.images.length > 0)

              this.applyFilters()
              this.isLoading = false
            },
            error: (error) => {
              console.error("Error loading gallery images:", error)
              this.isLoading = false
            },
          })
        } else {
          this.isLoading = false
        }
      },
      error: (error) => {
        console.error("Error loading projects:", error)
        this.isLoading = false
      },
    })
  }

  // Map gallery images to the format expected by the template
  mapGalleryImages(galleryImages: GalleryImage[], project: any): any[] {
    // If no gallery images, try to use project media or default images
    if (!galleryImages || galleryImages.length === 0) {
      // Create a default image if project has thumbnailImage
      if (project.thumbnailImage) {
        return [
          {
            url: project.thumbnailImage,
            type: "image",
            caption: "Project Thumbnail",
          },
        ]
      }
      return []
    }

    // Map gallery images to the format expected by the template
    return galleryImages.map((image) => ({
      url: image.url,
      type: image.type === "video" ? "video" : "image",
      caption: image.caption || `${project.name} - ${this.getImageTypeLabel(image.type)}`,
    }))
  }

  // Get label for image type
  getImageTypeLabel(type: string): string {
    switch (type) {
      case "building":
        return "Building Exterior"
      case "interior":
        return "Interior"
      case "video":
        return "Video"
      default:
        return type
    }
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
  openLightbox(project: GalleryProject, index: number): void {
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
