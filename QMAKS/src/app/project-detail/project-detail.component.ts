import { Component, OnInit } from "@angular/core"
import  { ActivatedRoute } from "@angular/router"
import {  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { MatSnackBar } from "@angular/material/snack-bar"
import  { ProjectService, Project } from "../services/project.service"

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

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.inquiryForm = this.fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      message: ["", [Validators.required]],
      visitDate: [""],
      preferredTime: [""],
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
        this.project = project
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
    if (this.project && this.project.brochureUrl) {
      window.open(this.project.brochureUrl, "_blank")
    }
  }

  submitInquiry(): void {
    if (this.inquiryForm.valid) {
      this.submitting = true

      // In a real application, you would send this data to your backend
      const formData = {
        ...this.inquiryForm.value,
        projectId: this.project?.id,
        projectName: this.project?.title,
      }

      // Simulate API call
      setTimeout(() => {
        console.log("Form submitted:", formData)
        this.snackBar.open("Your inquiry has been submitted successfully!", "Close", {
          duration: 5000,
          panelClass: ["success-snackbar"],
        })
        this.inquiryForm.reset()
        this.submitting = false
      }, 1500)
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.inquiryForm.controls).forEach((key) => {
        const control = this.inquiryForm.get(key)
        control?.markAsTouched()
      })
    }
  }
}

