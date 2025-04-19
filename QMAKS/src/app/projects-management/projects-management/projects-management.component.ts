import { Component,  OnInit } from "@angular/core"
import  { MatDialog } from "@angular/material/dialog"
import  { MatSnackBar } from "@angular/material/snack-bar"
import { ProjectService, Project } from "../../services/project.service"
import { ProjectFormDialogComponent } from "../project-form-dialog/project-form-dialog.component"
import { ProjectMediaDialogComponent } from "../project-media-dialog/project-media-dialog.component"
import { BrochureUploadDialogComponent } from "../../dashboard/featured-properties/brochure-upload-dialog/brochure-upload-dialog.component"
import { ConfirmDialogComponent } from "../../dashboard/hero-images/hero-image-form-dialog/confirm-dialog.component"
@Component({
  selector: 'app-projects-management',
  templateUrl: './projects-management.component.html',
  styleUrl: './projects-management.component.css'
})
export class ProjectsManagementComponent implements OnInit {
  projects: Project[] = []
  filteredProjects: Project[] = []
  isLoading = true
  displayedColumns: string[] = ["thumbnailImage", "name", "location", "type", "status", "size", "isFeatured", "actions"]

  // Filter values
  statusFilter = "All"
  typeFilter = "All"
  locationFilter = "All"

  // Filter options
  statusOptions: string[] = ["All", "Ongoing", "Completed", "Upcoming"]
  typeOptions: string[] = ["All"]
  locationOptions: string[] = ["All"]

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadProjects()
  }

  loadProjects(): void {
    this.isLoading = true
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data
        this.filteredProjects = [...data]
        this.isLoading = false
        this.extractFilterOptions()
        this.applyFilters()
      },
      error: (error) => {
        console.error("Error loading projects", error)
        this.snackBar.open("Error loading projects: " + (error.error?.message || "Unknown error"), "Close", {
          duration: 3000,
          panelClass: "error-snackbar",
        })
        this.isLoading = false
      },
    })
  }

  extractFilterOptions(): void {
    // Extract unique types
    const types = new Set<string>()
    this.projects.forEach((project) => types.add(project.type))
    this.typeOptions = ["All", ...Array.from(types)]

    // Extract unique locations
    const locations = new Set<string>()
    this.projects.forEach((project) => locations.add(project.location))
    this.locationOptions = ["All", ...Array.from(locations)]
  }

  applyFilters(): void {
    this.filteredProjects = this.projects.filter((project) => {
      // Apply status filter
      if (this.statusFilter !== "All" && project.status !== this.statusFilter) {
        return false
      }

      // Apply type filter
      if (this.typeFilter !== "All" && project.type !== this.typeFilter) {
        return false
      }

      // Apply location filter
      if (this.locationFilter !== "All" && project.location !== this.locationFilter) {
        return false
      }

      return true
    })
  }

  resetFilters(): void {
    this.statusFilter = "All"
    this.typeFilter = "All"
    this.locationFilter = "All"
    this.applyFilters()
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ProjectFormDialogComponent, {
      width: "800px",
      data: { mode: "add" },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true
        this.projectService.addProject(result).subscribe({
          next: () => {
            this.loadProjects()
            this.snackBar.open("Project added successfully", "Close", {
              duration: 3000,
              panelClass: "success-snackbar",
            })
          },
          error: (error) => {
            console.error("Error adding project", error)
            this.snackBar.open("Error adding project: " + (error.error?.message || "Unknown error"), "Close", {
              duration: 3000,
              panelClass: "error-snackbar",
            })
            this.isLoading = false
          },
        })
      }
    })
  }

  openEditDialog(project: Project): void {
    const dialogRef = this.dialog.open(ProjectFormDialogComponent, {
      width: "800px",
      data: { mode: "edit", project },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true
        this.projectService.updateProject(project.id, result).subscribe({
          next: () => {
            this.loadProjects()
            this.snackBar.open("Project updated successfully", "Close", {
              duration: 3000,
              panelClass: "success-snackbar",
            })
          },
          error: (error) => {
            console.error("Error updating project", error)
            this.snackBar.open("Error updating project: " + (error.error?.message || "Unknown error"), "Close", {
              duration: 3000,
              panelClass: "error-snackbar",
            })
            this.isLoading = false
          },
        })
      }
    })
  }

  openDeleteDialog(project: Project): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Confirm Delete",
        message: `Are you sure you want to delete the project "${project.name}"? This will also delete all associated media and brochures.`,
        confirmText: "Delete",
        cancelText: "Cancel",
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true
        this.projectService.deleteProject(project.id).subscribe({
          next: () => {
            this.loadProjects()
            this.snackBar.open("Project deleted successfully", "Close", {
              duration: 3000,
              panelClass: "success-snackbar",
            })
          },
          error: (error) => {
            console.error("Error deleting project", error)
            this.snackBar.open("Error deleting project: " + (error.error?.message || "Unknown error"), "Close", {
              duration: 3000,
              panelClass: "error-snackbar",
            })
            this.isLoading = false
          },
        })
      }
    })
  }

  openMediaDialog(project: Project): void {
    const dialogRef = this.dialog.open(ProjectMediaDialogComponent, {
      width: "900px",
      height: "80vh",
      data: { project },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProjects()
      }
    })
  }

  openBrochureUploadDialog(project: Project): void {
    const dialogRef = this.dialog.open(BrochureUploadDialogComponent, {
      width: "500px",
      data: { project },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true
        this.projectService.uploadBrochure(project.id, result).subscribe({
          next: () => {
            this.loadProjects()
            this.snackBar.open("Brochure uploaded successfully", "Close", {
              duration: 3000,
              panelClass: "success-snackbar",
            })
          },
          error: (error) => {
            console.error("Error uploading brochure", error)
            this.snackBar.open("Error uploading brochure: " + (error.error?.message || "Unknown error"), "Close", {
              duration: 3000,
              panelClass: "error-snackbar",
            })
            this.isLoading = false
          },
        })
      }
    })
  }

  toggleFeatured(project: Project): void {
    const formData = new FormData()
    formData.append("name", project.name)
    formData.append("location", project.location)
    formData.append("type", project.type)
    formData.append("status", project.status)
    formData.append("size", project.size)
    formData.append("completion", project.completion)
    formData.append("description", project.description)
    formData.append("fullDescription", project.fullDescription)
    formData.append("isFeatured", (!project.isFeatured).toString())

    this.isLoading = true
    this.projectService.updateProject(project.id, formData).subscribe({
      next: () => {
        this.loadProjects()
        this.snackBar.open(`Project ${project.isFeatured ? "removed from" : "added to"} featured properties`, "Close", {
          duration: 3000,
          panelClass: "success-snackbar",
        })
      },
      error: (error) => {
        console.error("Error updating project", error)
        this.snackBar.open("Error updating project: " + (error.error?.message || "Unknown error"), "Close", {
          duration: 3000,
          panelClass: "error-snackbar",
        })
        this.isLoading = false
      },
    })
  }

  downloadBrochure(project: Project): void {
    if (project.brochurePath) {
      window.open(project.brochurePath, "_blank")
    } else {
      this.snackBar.open("No brochure available for this project", "Close", {
        duration: 3000,
      })
    }
  }

  previewProject(project: Project): void {
    window.open(`/projects/${project.id}`, "_blank")
  }
}
