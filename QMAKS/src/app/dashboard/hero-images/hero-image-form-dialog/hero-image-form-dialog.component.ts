import { Component, Inject,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import {  MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
@Component({
  selector: 'app-hero-image-form-dialog',
  templateUrl: './hero-image-form-dialog.component.html',
  styleUrl: './hero-image-form-dialog.component.css'
})
export class HeroImageFormDialogComponent implements OnInit {
  heroImageForm: FormGroup
  isLoading = false
  imagePreview: string | ArrayBuffer | null = null
  formTitle: string
  submitButtonText: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<HeroImageFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formTitle = data.mode === 'add' ? 'Add Hero Image' : 'Edit Hero Image';
    this.submitButtonText = data.mode === 'add' ? 'Add' : 'Update';
    
    this.heroImageForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      subtitle: ['', [Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(200)]],
      displayOrder: [1, [Validators.required, Validators.min(1)]],
      image: [null, data.mode === 'add' ? Validators.required : null]
    });
    
    if (data.mode === 'edit' && data.heroImage) {
      this.heroImageForm.patchValue({
        title: data.heroImage.title,
        subtitle: data.heroImage.subtitle,
        description: data.heroImage.description,
        displayOrder: data.heroImage.displayOrder
      });
      
      this.imagePreview = data.heroImage.imagePath;
    }
  }

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      this.heroImageForm.patchValue({ image: file })
      this.heroImageForm.get("image")?.updateValueAndValidity()

      // Preview the selected image
      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  onSubmit(): void {
    if (this.heroImageForm.invalid) {
      return
    }

    this.isLoading = true

    const formData = new FormData()
    formData.append("title", this.heroImageForm.get("title")?.value)
    formData.append("subtitle", this.heroImageForm.get("subtitle")?.value)
    formData.append("description", this.heroImageForm.get("description")?.value)
    formData.append("displayOrder", this.heroImageForm.get("displayOrder")?.value)

    if (this.heroImageForm.get("image")?.value) {
      formData.append("image", this.heroImageForm.get("image")?.value)
    }

    this.dialogRef.close(formData)
  }

  onCancel(): void {
    this.dialogRef.close()
  }
}
