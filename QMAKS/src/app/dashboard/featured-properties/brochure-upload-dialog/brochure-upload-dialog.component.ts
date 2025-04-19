import { Component, Inject,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import {  MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"

@Component({
  selector: 'app-brochure-upload-dialog',
  templateUrl: './brochure-upload-dialog.component.html',
  styleUrl: './brochure-upload-dialog.component.css'
})
export class BrochureUploadDialogComponent implements OnInit {
  brochureForm: FormGroup
  isLoading = false
  selectedFileName: string | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BrochureUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.brochureForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      brochure: [null, Validators.required]
    })
    
    if (data.property && data.property.brochureTitle) {
      this.brochureForm.patchValue({
        title: data.property.brochureTitle
      })
    }
  }

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed")
        return
      }

      this.brochureForm.patchValue({ brochure: file })
      this.brochureForm.get("brochure")?.updateValueAndValidity()
      this.selectedFileName = file.name
    }
  }

  onSubmit(): void {
    if (this.brochureForm.invalid) return;
  
    this.isLoading = true;
    const formData = new FormData();
    formData.append("title", this.brochureForm.get("title")?.value);
    formData.append("brochure", this.brochureForm.get("brochure")?.value);
  
    this.dialogRef.close(formData);
    this.isLoading = false; // Reset loading state
  }
  onCancel(): void {
    this.dialogRef.close()
  }
}
