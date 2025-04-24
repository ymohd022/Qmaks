import { Component,  OnInit } from "@angular/core"
import  { ActivatedRoute } from "@angular/router"
import {  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { MatSnackBar } from "@angular/material/snack-bar"
import  { ProjectService, Project } from "../services/project.service"
import  { HttpClient } from "@angular/common/http"

@Component({
  selector: "app-project-detail",
  templateUrl: "./project-detail.component.html",
  styleUrl: "./project-detail.component.css",
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null
  loading = true
  inquiryForm: FormGroup
  activeGalleryTab = "photos"
  submitting = false
  private apiUrl = "http://localhost:3000/api/contact"

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private http: HttpClient,
  ) {
    this.inquiryForm = this.fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      message: ["", [Validators.required]],
      visitDate: [""],
      preferredTime: [""],
      scheduleVisit: [false],
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const projectId = params.get("id")
      if (projectId) {
        this.loadProject(projectId)
      }
    })
  }

  loadProject(id: string): void {
    this.loading = true
    this.projectService.getProject(id).subscribe(
      (project: Project) => {
        console.log("Loaded project details:", project)
        this.project = project

        // Ensure gallery, floorPlans, and architecturalRenders are arrays
        if (!this.project.gallery) this.project.gallery = []
        if (!this.project.floorPlans) this.project.floorPlans = []
        if (!this.project.architecturalRenders) this.project.architecturalRenders = []

        // Ensure title is set for compatibility
        if (!this.project.title) this.project.title = this.project.name

        // Ensure brochureUrl is set for compatibility
        if (!this.project.brochureUrl && this.project.brochurePath) {
          this.project.brochureUrl = this.project.brochurePath
        }

        this.loading = false
      },
      (error) => {
        console.error("Error loading project:", error)
        this.loading = false
      },
    )
  }

  setActiveGalleryTab(tab: string): void {
    this.activeGalleryTab = tab
  }

  downloadBrochure(): void {
    if (this.project && (this.project.brochureUrl || this.project.brochurePath)) {
      window.open(this.project.brochureUrl || this.project.brochurePath, "_blank")
    }
  }

  submitInquiry(): void {
    if (this.inquiryForm.valid && this.project) {
      this.submitting = true

      // Prepare form data with project information
      const formData = {
        ...this.inquiryForm.value,
        projectId: this.project.id,
        projectName: this.project.name,
      }

      // Send to backend
      this.http.post(`${this.apiUrl}/project-inquiry`, formData).subscribe({
        next: (response) => {
          this.snackBar.open("Your inquiry has been submitted successfully!", "Close", {
            duration: 5000,
            panelClass: ["success-snackbar"],
          })
          this.inquiryForm.reset()
          this.submitting = false
        },
        error: (error) => {
          console.error("Error submitting inquiry:", error)
          this.snackBar.open("Failed to submit inquiry. Please try again later.", "Close", {
            duration: 5000,
            panelClass: ["error-snackbar"],
          })
          this.submitting = false
        },
      })
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.inquiryForm.controls).forEach((key) => {
        const control = this.inquiryForm.get(key)
        control?.markAsTouched()
      })
    }
  }
}
