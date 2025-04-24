import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import {  Observable, throwError, of } from "rxjs"
import { catchError, tap } from "rxjs/operators"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = 'http://localhost:3000/api/auth';
  private tokenKey = "qmaks_auth_token"
  private userKey = "qmaks_user"

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token)
          localStorage.setItem(this.userKey, JSON.stringify(response.user))
        }
      }),
      catchError((error) => {
        console.error("Login error", error)
        return throwError(() => error)
      }),
    )
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userKey)
  }

  isLoggedIn(): boolean {
    return !!this.getToken()
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  getCurrentUser(): any {
    const userJson = localStorage.getItem(this.userKey)
    return userJson ? JSON.parse(userJson) : null
  }

  // For demo purposes, you can use this method to simulate login
  // Remove this in production and use the real login method
  demoLogin(email: string, password: string): Observable<any> {
    // Check if credentials match demo account
    if (email === "admin@qmaks.com" && password === "password123") {
      const response = {
        token: "demo-token-xyz",
        user: {
          id: 1,
          name: "Admin User",
          email: "admin@qmaks.com",
          role: "admin",
        },
      }

      localStorage.setItem(this.tokenKey, response.token)
      localStorage.setItem(this.userKey, JSON.stringify(response.user))

      return of(response)
    } else {
      return throwError(() => ({ error: { message: "Invalid email or password" } }))
    }
  }
}