import { Component, Inject,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import {  MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
@Component({
  selector: 'app-property-form-dialog',
  templateUrl: './property-form-dialog.component.html',
  styleUrl: './property-form-dialog.component.css'
})
export class PropertyFormDialogComponent implements OnInit {
  propertyForm: FormGroup
  isLoading = false
  imagePreview: string | ArrayBuffer | null = null
  formTitle: string
  submitButtonText: string
  statusOptions = ["Ongoing", "Completed", "Upcoming"];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PropertyFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formTitle = data.mode === 'add' ? 'Add Featured Property' : 'Edit Featured Property'
    this.submitButtonText = data.mode === 'add' ? 'Add' : 'Update'
    
    this.propertyForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      location: ['', [Validators.required, Validators.maxLength(100)]],
      type: ['', [Validators.required, Validators.maxLength(100)]],
      status: ['Ongoing', [Validators.required]],
      completion: ['', [Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      image: [null, data.mode === 'add' ? Validators.required : null]
    })
    
    if (data.mode === 'edit' && data.property) {
      this.propertyForm.patchValue({
        name: data.property.name,
        location: data.property.location,
        type: data.property.type,
        status: data.property.status,
        completion: data.property.completion,
        description: data.property.description
      })
      
      this.imagePreview = data.property.imagePath
    }
  }

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      this.propertyForm.patchValue({ image: file })
      this.propertyForm.get("image")?.updateValueAndValidity()

      // Preview the selected image
      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  onSubmit(): void {
    if (this.propertyForm.invalid) {
      return
    }

    this.isLoading = true

    const formData = new FormData()
    formData.append("name", this.propertyForm.get("name")?.value)
    formData.append("location", this.propertyForm.get("location")?.value)
    formData.append("type", this.propertyForm.get("type")?.value)
    formData.append("status", this.propertyForm.get("status")?.value)
    formData.append("completion", this.propertyForm.get("completion")?.value)
    formData.append("description", this.propertyForm.get("description")?.value)

    if (this.propertyForm.get("image")?.value) {
      formData.append("image", this.propertyForm.get("image")?.value)
    }

    this.dialogRef.close(formData)
  }

  onCancel(): void {
    this.dialogRef.close()
  }
}
