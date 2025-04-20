import { Component, Inject,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import {  MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"

@Component({
  selector: 'app-gallery-upload-dialog',
  templateUrl: './gallery-upload-dialog.component.html',
  styleUrl: './gallery-upload-dialog.component.css'
})
export class GalleryUploadDialogComponent implements OnInit {
  galleryForm: FormGroup
  isLoading = false
  imagePreview: string | ArrayBuffer | null = null
  formTitle: string
  submitButtonText: string
  isVideo = false
  videoUrl: string | null = null

  imageTypes = [
    { value: "building", label: "Building Image" },
    { value: "interior", label: "Interior Image" },
    { value: "video", label: "Video" },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GalleryUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formTitle = data.mode === "edit" ? "Edit Gallery Item" : "Add Gallery Item";
    this.submitButtonText = data.mode === "edit" ? "Update" : "Upload";
  
    this.galleryForm = this.fb.group({ // Corrected 'galleryFormm' to 'galleryForm'
      projectId: [data.projectId, Validators.required],
      type: ["building", Validators.required],
      caption: ["", [Validators.required, Validators.maxLength(100)]],
      file: [null, data.mode === "edit" ? null : Validators.required],
      videoUrl: [""],
    });
  
    if (data.mode === "edit" && data.image) {
      this.patchFormValues(data.image);
    }
  }

  ngOnInit(): void {}

  patchFormValues(image: any): void {
    this.galleryForm.patchValue({
      projectId: image.projectId,
      type: image.type,
      caption: image.caption,
    })

    if (image.type === "video") {
      this.isVideo = true
      this.galleryForm.patchValue({
        videoUrl: image.url,
      })
      this.videoUrl = image.url
    } else {
      this.imagePreview = image.url
    }
  }

  onTypeChange(event: any): void {
    const selectedType = event.value
    this.isVideo = selectedType === "video"

    if (this.isVideo) {
      this.galleryForm.get("file")?.clearValidators()
      this.galleryForm.get("videoUrl")?.setValidators([Validators.required])
    } else {
      this.galleryForm.get("videoUrl")?.clearValidators()
      if (this.data.mode !== "edit") {
        this.galleryForm.get("file")?.setValidators([Validators.required])
      }
    }

    this.galleryForm.get("file")?.updateValueAndValidity()
    this.galleryForm.get("videoUrl")?.updateValueAndValidity()
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      this.galleryForm.patchValue({ file: file })
      this.galleryForm.get("file")?.updateValueAndValidity()

      // Preview the selected image
      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  onSubmit(): void {
    if (this.galleryForm.invalid) {
      return
    }

    this.isLoading = true

    const formData = new FormData()
    formData.append("projectId", this.galleryForm.get("projectId")?.value)
    formData.append("type", this.galleryForm.get("type")?.value)
    formData.append("caption", this.galleryForm.get("caption")?.value)

    if (this.isVideo) {
      formData.append("videoUrl", this.galleryForm.get("videoUrl")?.value)
    } else if (this.galleryForm.get("file")?.value) {
      formData.append("file", this.galleryForm.get("file")?.value)
    }

    this.dialogRef.close(formData)
  }

  onCancel(): void {
    this.dialogRef.close()
  }
}
