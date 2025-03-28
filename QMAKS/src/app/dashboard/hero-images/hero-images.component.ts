import { Component,  OnInit } from "@angular/core"
import  { MatDialog } from "@angular/material/dialog"
import  { MatSnackBar } from "@angular/material/snack-bar"
import { HeroImageService } from "../../services/hero-image.service"
import { HeroImageFormDialogComponent } from "./hero-image-form-dialog/hero-image-form-dialog.component"
import { ConfirmDialogComponent } from "./hero-image-form-dialog/confirm-dialog.component"
@Component({
  selector: 'app-hero-images',
  templateUrl: './hero-images.component.html',
  styleUrl: './hero-images.component.css'
})
export class HeroImagesComponent implements OnInit {
  heroImages: any[] = []
  isLoading = true
  displayedColumns: string[] = ["image", "title", "subtitle", "description", "displayOrder", "actions"]

  constructor(
    private heroImageService: HeroImageService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadHeroImages()
  }

  loadHeroImages(): void {
    this.isLoading = true
    this.heroImageService.getHeroImages().subscribe({
      next: (data) => {
        this.heroImages = data
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading hero images", error)
        this.snackBar.open("Error loading hero images", "Close", {
          duration: 3000,
          panelClass: "error-snackbar",
        })
        this.isLoading = false
      },
    })
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(HeroImageFormDialogComponent, {
      width: "600px",
      data: { mode: "add" },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true
        this.heroImageService.addHeroImage(result).subscribe({
          next: () => {
            this.loadHeroImages()
            this.snackBar.open("Hero image added successfully", "Close", {
              duration: 3000,
              panelClass: "success-snackbar",
            })
          },
          error: (error) => {
            console.error("Error adding hero image", error)
            this.snackBar.open("Error adding hero image", "Close", {
              duration: 3000,
              panelClass: "error-snackbar",
            })
            this.isLoading = false
          },
        })
      }
    })
  }

  openEditDialog(heroImage: any): void {
    const dialogRef = this.dialog.open(HeroImageFormDialogComponent, {
      width: "600px",
      data: { mode: "edit", heroImage },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true
        this.heroImageService.updateHeroImage(heroImage.id, result).subscribe({
          next: () => {
            this.loadHeroImages()
            this.snackBar.open("Hero image updated successfully", "Close", {
              duration: 3000,
              panelClass: "success-snackbar",
            })
          },
          error: (error) => {
            console.error("Error updating hero image", error)
            this.snackBar.open("Error updating hero image", "Close", {
              duration: 3000,
              panelClass: "error-snackbar",
            })
            this.isLoading = false
          },
        })
      }
    })
  }

  openDeleteDialog(heroImage: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Confirm Delete",
        message: `Are you sure you want to delete the hero image "${heroImage.title}"?`,
        confirmText: "Delete",
        cancelText: "Cancel",
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true
        this.heroImageService.deleteHeroImage(heroImage.id).subscribe({
          next: () => {
            this.loadHeroImages()
            this.snackBar.open("Hero image deleted successfully", "Close", {
              duration: 3000,
              panelClass: "success-snackbar",
            })
          },
          error: (error) => {
            console.error("Error deleting hero image", error)
            this.snackBar.open("Error deleting hero image", "Close", {
              duration: 3000,
              panelClass: "error-snackbar",
            })
            this.isLoading = false
          },
        })
      }
    })
  }

  updateDisplayOrder(heroImage: any, newOrder: number): void {
    this.isLoading = true
    this.heroImageService.updateHeroImage(heroImage.id, { ...heroImage, displayOrder: newOrder }).subscribe({
      next: () => {
        this.loadHeroImages()
        this.snackBar.open("Display order updated successfully", "Close", {
          duration: 3000,
          panelClass: "success-snackbar",
        })
      },
      error: (error) => {
        console.error("Error updating display order", error)
        this.snackBar.open("Error updating display order", "Close", {
          duration: 3000,
          panelClass: "error-snackbar",
        })
        this.isLoading = false
      },
    })
  }

  previewHeroImage(heroImage: any): void {
    // Open a dialog or navigate to a preview page
    window.open(heroImage.imagePath, "_blank")
  }
}
