import { Component,  OnInit } from "@angular/core"
import  { MatDialog } from "@angular/material/dialog"
import  { MatSnackBar } from "@angular/material/snack-bar"
import { FeaturedPropertyService } from "../../services/featured-property.service"
import { PropertyFormDialogComponent } from "./property-form-dialog/property-form-dialog.component"
import { BrochureUploadDialogComponent } from "./brochure-upload-dialog/brochure-upload-dialog.component"
import { ConfirmDialogComponent } from "../hero-images/hero-image-form-dialog/confirm-dialog.component"

@Component({
  selector: 'app-featured-properties',
  templateUrl: './featured-properties.component.html',
  styleUrl: './featured-properties.component.css'
})
export class FeaturedPropertiesComponent implements OnInit {
  properties: any[] = []
  isLoading = true
  displayedColumns: string[] = ["image", "name", "location", "type", "status", "completion", "brochure", "actions"]
  statusFilters = ["All", "Ongoing", "Completed", "Upcoming"]
  selectedFilter = "All"

  constructor(
    private propertyService: FeaturedPropertyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadProperties()
  }

  loadProperties(): void {
    this.isLoading = true
    this.propertyService.getFeaturedProperties().subscribe({
      next: (data) => {
        this.properties = data
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading properties", error)
        this.snackBar.open("Error loading properties: " + (error.error?.message || "Unknown error"), "Close", {
          duration: 3000,
          panelClass: "error-snackbar",
        })
        this.isLoading = false
      },
    })
  }

  filterProperties(): any[] {
    if (this.selectedFilter === "All") {
      return this.properties
    }
    return this.properties.filter((property) => property.status === this.selectedFilter)
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(PropertyFormDialogComponent, {
      width: "800px",
      data: { mode: "add" },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true
        this.propertyService.addFeaturedProperty(result).subscribe({
          next: () => {
            this.loadProperties()
            this.snackBar.open("Property added successfully", "Close", {
              duration: 3000,
              panelClass: "success-snackbar",
            })
          },
          error: (error) => {
            console.error("Error adding property", error)
            this.snackBar.open("Error adding property: " + (error.error?.message || "Unknown error"), "Close", {
              duration: 3000,
              panelClass: "error-snackbar",
            })
            this.isLoading = false
          },
        })
      }
    })
  }

  openEditDialog(property: any): void {
    const dialogRef = this.dialog.open(PropertyFormDialogComponent, {
      width: "800px",
      data: { mode: "edit", property },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true
        this.propertyService.updateFeaturedProperty(property.id, result).subscribe({
          next: () => {
            this.loadProperties()
            this.snackBar.open("Property updated successfully", "Close", {
              duration: 3000,
              panelClass: "success-snackbar",
            })
          },
          error: (error) => {
            console.error("Error updating property", error)
            this.snackBar.open("Error updating property: " + (error.error?.message || "Unknown error"), "Close", {
              duration: 3000,
              panelClass: "error-snackbar",
            })
            this.isLoading = false
          },
        })
      }
    })
  }

  openDeleteDialog(property: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Confirm Delete",
        message: `Are you sure you want to delete the property "${property.name}"?`,
        confirmText: "Delete",
        cancelText: "Cancel",
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true
        this.propertyService.deleteFeaturedProperty(property.id).subscribe({
          next: () => {
            this.loadProperties()
            this.snackBar.open("Property deleted successfully", "Close", {
              duration: 3000,
              panelClass: "success-snackbar",
            })
          },
          error: (error) => {
            console.error("Error deleting property", error)
            this.snackBar.open("Error deleting property: " + (error.error?.message || "Unknown error"), "Close", {
              duration: 3000,
              panelClass: "error-snackbar",
            })
            this.isLoading = false
          },
        })
      }
    })
  }

  openBrochureUploadDialog(property: any): void {
    const dialogRef = this.dialog.open(BrochureUploadDialogComponent, {
      width: "500px",
      data: { property },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true
        this.propertyService.uploadBrochure(property.id, result).subscribe({
          next: () => {
            this.loadProperties()
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

  downloadBrochure(property: any): void {
    if (property.brochurePath) {
      this.propertyService.getFeaturedProperty(property.id).subscribe({
        next: (prop) => {
          const downloadUrl = `${this.propertyService.getApiUrl()}/${property.id}/brochure`;
          window.open(downloadUrl, '_blank');
        },
        error: (error) => {
          this.snackBar.open("Error fetching brochure", "Close", {
            duration: 3000,
          });
        }
      });
    } else {
      this.snackBar.open("No brochure available", "Close", {
        duration: 3000,
      });
    }
  }

  previewProperty(property: any): void {
    window.open(property.imagePath, "_blank")
  }
}
