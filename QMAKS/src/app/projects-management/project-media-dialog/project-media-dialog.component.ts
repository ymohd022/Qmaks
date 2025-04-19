import { Component, Inject,  OnInit } from "@angular/core"
import {  MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import  { MatSnackBar } from "@angular/material/snack-bar"
import  { ProjectService, ProjectMedia } from "../../services/project.service"
import {  CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop"

@Component({
  selector: "app-project-media-dialog",
  templateUrl: "./project-media-dialog.component.html",
  styleUrl: "./project-media-dialog.component.css",
})
export class ProjectMediaDialogComponent implements OnInit {
  projectMedia: ProjectMedia[] = []
  photos: ProjectMedia[] = []
  floorPlans: ProjectMedia[] = []
  renders: ProjectMedia[] = []
  isLoading = true
  activeTab = "photos"
  uploadingMedia = false
  selectedIndex = 0; // Added for tab selection

  constructor(
    public dialogRef: MatDialogRef<ProjectMediaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadProjectMedia()
  }

  loadProjectMedia(): void {
    this.isLoading = true
    this.projectService.getProjectMedia(this.data.project.id).subscribe({
      next: (media) => {
        this.projectMedia = media
        this.filterMediaByType()
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading project media", error)
        this.snackBar.open("Error loading project media: " + (error.error?.message || "Unknown error"), "Close", {
          duration: 3000,
          panelClass: "error-snackbar",
        })
        this.isLoading = false
      },
    })
  }

  filterMediaByType(): void {
    this.photos = this.projectMedia
      .filter((media) => media.type === "photo")
      .sort((a, b) => a.displayOrder - b.displayOrder)

    this.floorPlans = this.projectMedia
      .filter((media) => media.type === "floorPlan")
      .sort((a, b) => a.displayOrder - b.displayOrder)

    this.renders = this.projectMedia
      .filter((media) => media.type === "render")
      .sort((a, b) => a.displayOrder - b.displayOrder)
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab
    if (tab === "photos") {
      this.selectedIndex = 0
    } else if (tab === "floorPlans") {
      this.selectedIndex = 1
    } else {
      this.selectedIndex = 2
    }
  }

  onTabChange(event: any): void {
    const index = event
    if (index === 0) {
      this.activeTab = "photos"
    } else if (index === 1) {
      this.activeTab = "floorPlans"
    } else {
      this.activeTab = "renders"
    }
  }

  onFileSelected(event: Event, mediaType: "photo" | "floorPlan" | "render"): void {
    const files = (event.target as HTMLInputElement).files
    if (!files || files.length === 0) return

    this.uploadingMedia = true

    // Create a FormData object for each file
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData()
      formData.append("media", files[i])
      formData.append("type", mediaType)

      // Calculate display order (add to end of current list)
      let displayOrder = 0
      if (mediaType === "photo") {
        displayOrder = this.photos.length > 0 ? Math.max(...this.photos.map((p) => p.displayOrder)) + 1 : 0
      } else if (mediaType === "floorPlan") {
        displayOrder = this.floorPlans.length > 0 ? Math.max(...this.floorPlans.map((p) => p.displayOrder)) + 1 : 0
      } else {
        displayOrder = this.renders.length > 0 ? Math.max(...this.renders.map((p) => p.displayOrder)) + 1 : 0
      }

      formData.append("displayOrder", displayOrder.toString())

      // Upload the file
      this.projectService.addProjectMedia(this.data.project.id, formData).subscribe({
        next: () => {
          if (i === files.length - 1) {
            this.uploadingMedia = false
            this.loadProjectMedia()
            this.snackBar.open("Media uploaded successfully", "Close", {
              duration: 3000,
              panelClass: "success-snackbar",
            })
          }
        },
        error: (error) => {
          this.uploadingMedia = false
          console.error("Error uploading media", error)
          this.snackBar.open("Error uploading media: " + (error.error?.message || "Unknown error"), "Close", {
            duration: 3000,
            panelClass: "error-snackbar",
          })
        },
      })
    }
    // Reset the file input
    ;(event.target as HTMLInputElement).value = ""
  }

  deleteMedia(media: ProjectMedia): void {
    this.isLoading = true
    this.projectService.deleteProjectMedia(this.data.project.id, media.id).subscribe({
      next: () => {
        this.loadProjectMedia()
        this.snackBar.open("Media deleted successfully", "Close", {
          duration: 3000,
          panelClass: "success-snackbar",
        })
      },
      error: (error) => {
        console.error("Error deleting media", error)
        this.snackBar.open("Error deleting media: " + (error.error?.message || "Unknown error"), "Close", {
          duration: 3000,
          panelClass: "error-snackbar",
        })
        this.isLoading = false
      },
    })
  }

  onDrop(event: CdkDragDrop<ProjectMedia[]>, mediaType: "photo" | "floorPlan" | "render"): void {
    let mediaList: ProjectMedia[]

    if (mediaType === "photo") {
      mediaList = this.photos
    } else if (mediaType === "floorPlan") {
      mediaList = this.floorPlans
    } else {
      mediaList = this.renders
    }

    if (event.previousIndex === event.currentIndex) return

    // Update the array locally
    moveItemInArray(mediaList, event.previousIndex, event.currentIndex)

    // Update display orders
    const mediaIds = mediaList.map((media) => media.id)

    this.isLoading = true
    this.projectService.updateMediaOrder(this.data.project.id, mediaIds).subscribe({
      next: () => {
        this.loadProjectMedia()
        this.snackBar.open("Media order updated successfully", "Close", {
          duration: 3000,
          panelClass: "success-snackbar",
        })
      },
      error: (error) => {
        console.error("Error updating media order", error)
        this.snackBar.open("Error updating media order: " + (error.error?.message || "Unknown error"), "Close", {
          duration: 3000,
          panelClass: "error-snackbar",
        })
        this.isLoading = false
      },
    })
  }

  close(result = false): void {
    this.dialogRef.close(result)
  }
}
