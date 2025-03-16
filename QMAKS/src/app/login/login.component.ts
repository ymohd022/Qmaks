import { Component, OnInit } from "@angular/core"
import {  FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { AuthService } from "../services/auth.service"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  isLoading = false
  hidePassword = true
  loginError = ""

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  ngOnInit(): void {
    // Check if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/admin/dashboard"])
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true
      this.loginError = ""

      const { email, password } = this.loginForm.value

      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.isLoading = false
          this.snackBar.open("Login successful!", "Close", {
            duration: 3000,
            panelClass: "success-snackbar",
          })
          this.router.navigate(["/admin/dashboard"])
        },
        error: (error) => {
          this.isLoading = false
          this.loginError = error.error.message || "Invalid email or password"
          this.snackBar.open(this.loginError, "Close", {
            duration: 5000,
            panelClass: "error-snackbar",
          })
        },
      })
    } else {
      this.loginForm.markAllAsTouched()
    }
  }

  getEmailErrorMessage(): string {
    if (this.loginForm.get("email")?.hasError("required")) {
      return "Email is required"
    }
    return this.loginForm.get("email")?.hasError("email") ? "Not a valid email" : ""
  }

  getPasswordErrorMessage(): string {
    if (this.loginForm.get("password")?.hasError("required")) {
      return "Password is required"
    }
    return this.loginForm.get("password")?.hasError("minlength") ? "Password must be at least 6 characters" : ""
  }
}
