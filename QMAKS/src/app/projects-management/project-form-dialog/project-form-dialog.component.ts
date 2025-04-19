import { Component, Inject,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators,  FormArray } from "@angular/forms"
import {  MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
@Component({
  selector: 'app-project-form-dialog',
  templateUrl: './project-form-dialog.component.html',
  styleUrl: './project-form-dialog.component.css'
})
export class ProjectFormDialogComponent implements OnInit {
  projectForm: FormGroup
  isLoading = false
  imagePreview: string | ArrayBuffer | null = null
  formTitle: string
  submitButtonText: string
  statusOptions = ["Ongoing", "Completed", "Upcoming"];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProjectFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formTitle = data.mode === 'add' ? 'Add Project' : 'Edit Project';
    this.submitButtonText = data.mode === 'add' ? 'Add' : 'Update';

    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      location: ['', [Validators.required, Validators.maxLength(100)]],
      type: ['', [Validators.required, Validators.maxLength(100)]],
      status: ['Ongoing', [Validators.required]],
      size: ['', [Validators.required, Validators.maxLength(50)]],
      completion: ['', [Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      fullDescription: ['', [Validators.required]],
      isFeatured: [false],
      image: [null, data.mode === 'add' ? Validators.required : null],
      specifications: this.fb.array([]),
      features: this.fb.array([])
    })
    
    if (data.mode === 'edit' && data.project) {
      this.patchFormValues(data.project)
      this.imagePreview = data.project.thumbnailImage
    } else {
      // Add default specification fields
      this.addSpecification('Construction Start', '')
      this.addSpecification('Expected Completion', '')
      this.addSpecification('Project Type', '')
      this.addSpecification('Total Area', '')
      
      // Add default feature fields
      this.addFeature('')
      this.addFeature('')
      this.addFeature('')
    }
  }

  ngOnInit(): void {}

  patchFormValues(project: any): void {
    this.projectForm.patchValue({
      name: project.name,
      location: project.location,
      type: project.type,
      status: project.status,
      size: project.size,
      completion: project.completion,
      description: project.description,
      fullDescription: project.fullDescription,
      isFeatured: project.isFeatured,
    })

    // Clear default specifications and add from project
    this.specificationsArray.clear()
    if (project.specifications) {
      Object.entries(project.specifications).forEach(([key, value]) => {
        this.addSpecification(key, value as string)
      })
    }

    // Clear default features and add from project
    this.featuresArray.clear()
    if (project.features && project.features.length > 0) {
      project.features.forEach((feature: string) => {
        this.addFeature(feature)
      })
    }
  }

  get specificationsArray(): FormArray {
    return this.projectForm.get("specifications") as FormArray
  }

  get featuresArray(): FormArray {
    return this.projectForm.get("features") as FormArray
  }

  addSpecification(key = "", value = ""): void {
    this.specificationsArray.push(
      this.fb.group({
        key: [key, Validators.required],
        value: [value, Validators.required],
      }),
    )
  }

  removeSpecification(index: number): void {
    this.specificationsArray.removeAt(index)
  }

  addFeature(feature = ""): void {
    this.featuresArray.push(this.fb.control(feature, Validators.required))
  }

  removeFeature(index: number): void {
    this.featuresArray.removeAt(index)
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      this.projectForm.patchValue({ image: file })
      this.projectForm.get("image")?.updateValueAndValidity()

      // Preview the selected image
      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      return
    }

    this.isLoading = true

    const formData = new FormData()
    formData.append("name", this.projectForm.get("name")?.value)
    formData.append("location", this.projectForm.get("location")?.value)
    formData.append("type", this.projectForm.get("type")?.value)
    formData.append("status", this.projectForm.get("status")?.value)
    formData.append("size", this.projectForm.get("size")?.value)
    formData.append("completion", this.projectForm.get("completion")?.value)
    formData.append("description", this.projectForm.get("description")?.value)
    formData.append("fullDescription", this.projectForm.get("fullDescription")?.value)
    formData.append("isFeatured", this.projectForm.get("isFeatured")?.value)

    // Process specifications
    const specifications: Record<string, string> = {}
    this.specificationsArray.controls.forEach((control) => {
      const specGroup = control as FormGroup
      specifications[specGroup.get("key")?.value] = specGroup.get("value")?.value
    })
    formData.append("specifications", JSON.stringify(specifications))

    // Process features
    const features = this.featuresArray.value
    formData.append("features", JSON.stringify(features))

    if (this.projectForm.get("image")?.value) {
      formData.append("image", this.projectForm.get("image")?.value)
    }

    this.dialogRef.close(formData)
  }

  onCancel(): void {
    this.dialogRef.close()
  }
}
