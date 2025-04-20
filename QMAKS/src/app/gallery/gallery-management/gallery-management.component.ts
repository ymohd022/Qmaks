import { Component,  OnInit } from "@angular/core"
import  { MatDialog } from "@angular/material/dialog"
import  { MatSnackBar } from "@angular/material/snack-bar"
import { GalleryService, GalleryImage } from "../../services/gallery.service"
import { ProjectService, Project } from "../../services/project.service"
import { GalleryUploadDialogComponent } from "../gallery-upload-dialog/gallery-upload-dialog.component"
import { ConfirmDialogComponent } from "../../dashboard/hero-images/hero-image-form-dialog/confirm-dialog.component"
import {  CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop"
@Component({
  selector: 'app-gallery-management',
  templateUrl: './gallery-management.component.html',
  styleUrl: './gallery-management.component.css'
})
export class GalleryManagementComponent implements OnInit {
  projects: Project[] = []
  galleryImages: GalleryImage[] = []
  filteredImages: GalleryImage[] = []
  isLoading = true
  selectedProjectId: number | null = null
  selectedImageType = "all"

  imageTypes = [
    { value: "all", label: "All Images" },
    { value: "building", label: "Building Images" },
    { value: "interior", label: "Interior Images" },
    { value: "video", label: "Videos" },
  ]

  constructor(
    private galleryService: GalleryService,
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
      next: (projects) => {
        this.projects = projects
        this.isLoading = false

        // If there are projects, select the first one by default
        if (projects.length > 0) {
          this.selectProject(projects[0].id)
        }
      },
      error: (error) => {
        console.error("Error loading projects:", error)
        this.snackBar.open("Error loading projects: " + (error.error?.message || "Unknown error"), "Close", {
          duration: 3000,
          panelClass: "error-snackbar",
        })
        this.isLoading = false
      },
    })
  }

  selectProject(projectId: number): void {
    this.selectedProjectId = projectId
    this.loadGalleryImages(projectId)
  }

  loadGalleryImages(projectId: number): void {
    this.isLoading = true
    this.galleryService.getGalleryImagesByProject(projectId).subscribe({
      next: (images) => {
        this.galleryImages = images
        this.applyFilters()
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading gallery images:", error)
        this.snackBar.open("Error loading gallery images: " + (error.error?.message || "Unknown error"), "Close", {
          duration: 3000,
          panelClass: "error-snackbar",
        })
        this.isLoading = false
      },
    })
  }

  applyFilters(): void {
    if (this.selectedImageType === "all") {
      this.filteredImages = [...this.galleryImages]
    } else {
      this.filteredImages = this.galleryImages.filter((image) => image.type === this.selectedImageType)
    }
  }

  onImageTypeChange(event: any): void {
    this.selectedImageType = event.value
    this.applyFilters()
  }

  openUploadDialog(): void {
    if (!this.selectedProjectId) {
      this.snackBar.open("Please select a project first", "Close", {
        duration: 3000,
      })
      return
    }

    const selectedProject = this.projects.find((p) => p.id === this.selectedProjectId)

    const dialogRef = this.dialog.open(GalleryUploadDialogComponent, {
      width: "600px",
      data: {
        projectId: this.selectedProjectId,
        projectName: selectedProject?.name || "Project",
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true
        this.galleryService.addGalleryImage(result).subscribe({
          next: () => {
            this.loadGalleryImages(this.selectedProjectId!)
            this.snackBar.open("Gallery image added successfully", "Close", {
              duration: 3000,
              panelClass: "success-snackbar",
            })
          },
          error: (error) => {
            console.error("Error adding gallery image:", error)
            this.snackBar.open("Error adding gallery image: " + (error.error?.message || "Unknown error"), "Close", {
              duration: 3000,
              panelClass: "error-snackbar",
            })
            this.isLoading = false
          },
        })
      }
    })
  }

  openEditDialog(image: GalleryImage): void {
    const selectedProject = this.projects.find((p) => p.id === image.projectId)

    const dialogRef = this.dialog.open(GalleryUploadDialogComponent, {
      width: "600px",
      data: {
        mode: "edit",
        image: image,
        projectId: image.projectId,
        projectName: selectedProject?.name || "Project",
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true
        this.galleryService.updateGalleryImage(image.id, result).subscribe({
          next: () => {
            this.loadGalleryImages(this.selectedProjectId!)
            this.snackBar.open("Gallery image updated successfully", "Close", {
              duration: 3000,
              panelClass: "success-snackbar",
            })
          },
          error: (error) => {
            console.error("Error updating gallery image:", error)
            this.snackBar.open("Error updating gallery image: " + (error.error?.message || "Unknown error"), "Close", {
              duration: 3000,
              panelClass: "error-snackbar",
            })
            this.isLoading = false
          },
        })
      }
    })
  }

  openDeleteDialog(image: GalleryImage): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Confirm Delete",
        message: `Are you sure you want to delete this ${image.type} image?`,
        confirmText: "Delete",
        cancelText: "Cancel",
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true
        this.galleryService.deleteGalleryImage(image.id).subscribe({
          next: () => {
            this.loadGalleryImages(this.selectedProjectId!)
            this.snackBar.open("Gallery image deleted successfully", "Close", {
              duration: 3000,
              panelClass: "success-snackbar",
            })
          },
          error: (error) => {
            console.error("Error deleting gallery image:", error)
            this.snackBar.open("Error deleting gallery image: " + (error.error?.message || "Unknown error"), "Close", {
              duration: 3000,
              panelClass: "error-snackbar",
            })
            this.isLoading = false
          },
        })
      }
    })
  }

  onDrop(event: CdkDragDrop<GalleryImage[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return
    }

    moveItemInArray(this.filteredImages, event.previousIndex, event.currentIndex)

    // Update the display order in the backend
    const imageIds = this.filteredImages.map((image) => image.id)

    this.galleryService.updateGalleryOrder(this.selectedProjectId!, imageIds).subscribe({
      next: () => {
        this.snackBar.open("Gallery order updated successfully", "Close", {
          duration: 3000,
          panelClass: "success-snackbar",
        })
      },
      error: (error) => {
        console.error("Error updating gallery order:", error)
        this.snackBar.open("Error updating gallery order: " + (error.error?.message || "Unknown error"), "Close", {
          duration: 3000,
          panelClass: "error-snackbar",
        })
        // Reload to get the correct order
        this.loadGalleryImages(this.selectedProjectId!)
      },
    })
  }

  getImageTypeLabel(type: string): string {
    const imageType = this.imageTypes.find((t) => t.value === type)
    return imageType ? imageType.label : type
  }

  isVideo(image: GalleryImage): boolean {
    return image.type === "video"
  }

  getImageUrl(image: GalleryImage): string {
    return this.isVideo(image) && image.thumbnailUrl ? image.thumbnailUrl : image.url
  }

  getProjectName(projectId: number | null): string {
    const project = this.projects.find((p) => p.id === projectId);
    return project ? project.name : '';
  }
}
