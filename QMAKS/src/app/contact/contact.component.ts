import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactService } from '../services/contact.service';

// Declare google variable globally
declare var google: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer')
  mapContainer!: ElementRef;
  
  contactForm!: FormGroup;
  isSubmitting = false;
  submitted = false;
  
  // Company information
  companyInfo = {
    name: 'Your Company Name',
    address: '123 Business Avenue, Suite 200, New York, NY 10001',
    phone: '903-233-2744',
    email: 'info@yourcompany.com',
    hours: 'Monday - Friday: 9:00 AM - 5:00 PM',
    socialMedia: [
      { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com/yourcompany' },
      { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/yourcompany' },
      { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/yourcompany' },
      { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/company/yourcompany' }
    ],
    mapLocation: {
      lat: 40.7128,
      lng: -74.0060
    }
  };
  
  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
  }
  
  ngAfterViewInit(): void {
    this.initMap();
  }
  
  // Initialize contact form
  initForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9]{10,15}$')]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  
  // Initialize Google Maps
  initMap(): void {
    // Check if Google Maps API is loaded
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
      script.async = true;
      script.defer = true;
      script.onload = () => this.loadMap();
      document.head.appendChild(script);
    } else {
      this.loadMap();
    }
  }
  
  // Load map after API is available
  loadMap(): void {
    const mapOptions = {
      center: new google.maps.LatLng(
        this.companyInfo.mapLocation.lat,
        this.companyInfo.mapLocation.lng
      ),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    const map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    
    // Add marker for company location
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(
        this.companyInfo.mapLocation.lat,
        this.companyInfo.mapLocation.lng
      ),
      map: map,
      title: this.companyInfo.name
    });
    
    // Add info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="info-window">
          <h5>${this.companyInfo.name}</h5>
          <p>${this.companyInfo.address}</p>
        </div>
      `
    });
    
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  }
  
  // Submit contact form
  onSubmit(): void {
    this.submitted = true;
    
    if (this.contactForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    
    this.contactService.submitContactForm(this.contactForm.value)
      .subscribe(
        response => {
          this.isSubmitting = false;
          this.snackBar.open('Your message has been sent successfully!', 'Close', {
            duration: 5000,
            panelClass: 'success-snackbar'
          });
          this.contactForm.reset();
          this.submitted = false;
        },
        error => {
          this.isSubmitting = false;
          this.snackBar.open('Failed to send message. Please try again later.', 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar'
          });
          console.error('Error submitting form:', error);
        }
      );
  }
  
  // Form validation helpers
  get f() { return this.contactForm.controls; }
  
  hasError(controlName: string, errorName: string): boolean {
    return this.f[controlName].hasError(errorName) && 
           (this.f[controlName].dirty || this.f[controlName].touched || this.submitted);
  }
}