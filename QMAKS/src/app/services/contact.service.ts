import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl: string = 'http://localhost:3000/contact';

  constructor(private http: HttpClient) { }

  // Submit contact form
  submitContactForm(formData: ContactFormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}