import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { HeroImageService } from '../services/hero-image.service';
import { FeaturedPropertyService } from '../services/featured-property.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('0.5s ease-in-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideInFromLeft', [
      state('void', style({ transform: 'translateX(-100px)', opacity: 0 })),
      transition(':enter', [
        animate('0.5s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('slideInFromRight', [
      state('void', style({ transform: 'translateX(100px)', opacity: 0 })),
      transition(':enter', [
        animate('0.5s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('slideInFromBottom', [
      state('void', style({ transform: 'translateY(50px)', opacity: 0 })),
      transition(':enter', [
        animate('0.5s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('counterAnimation', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('0.8s ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  heroSlides: any[] = [];
  featuredProjects: any[] = [];
  
  // Stats
  stats = [
    { icon: 'apartment', value: 80, label: 'Properties Completed', suffix: '+' },
    { icon: 'groups', value: 2000, label: 'Happy Families', suffix: '+' },
    { icon: 'location_city', value: 15, label: 'Cities Present', suffix: '' },
    { icon: 'engineering', value: 25, label: 'Years Experience', suffix: '+' }
  ];
  
 
  
  // Testimonials
  testimonials = [
    {
      id: 1,
      name: 'John & Sarah Thompson',
      image: 'profile.png',
      project: 'Royal Heights',
      quote: 'Moving into our QMAKS home was the best decision we made. The quality of construction and attention to detail is exceptional.'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      image: 'profile.png',
      project: 'Green Valley Villas',
      quote: 'The team at QMAKS made our home buying journey smooth and transparent. Their after-sales service is truly commendable.'
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      image: 'profile.png',
      project: 'Skyline Towers',
      quote: 'As a first-time homebuyer, I appreciated the guidance and support from QMAKS. They delivered exactly what they promised.'
    }
  ];
  
  // Awards
  awards = [
    {
      year: '2023',
      title: 'Best Residential Developer',
      organization: 'Real Estate Excellence Awards'
    },
    {
      year: '2022',
      title: 'Green Building Initiative',
      organization: 'Sustainable Construction Council'
    },
    {
      year: '2021',
      title: 'Customer Satisfaction Award',
      organization: 'Housing Association'
    }
  ];
  
  // Current slide index
  currentSlide = 0;
  
  // Animation states
  statsAnimated = false;
  
  constructor(
    private heroImageService: HeroImageService,
    private featuredPropertyService: FeaturedPropertyService
  ) { }
  
  ngOnInit(): void {
    this.loadHeroImages();
    this.loadFeaturedProperties();

    // Auto-rotate hero slider
    setInterval(() => {
      this.nextSlide();
    }, 5000);
    
    // Observe stats section for animation
    this.observeStats();
  }

  private loadHeroImages(): void {
    this.heroImageService.getHeroImages().subscribe({
      next: (images) => {
        this.heroSlides = images.map(img => ({
          image: img.imagePath,
          title: img.title,
          subtitle: img.subtitle,
          description: img.description
        }));
      },
      error: (error) => console.error('Error loading hero images:', error)
    });
  }

  private loadFeaturedProperties(): void {
    this.featuredPropertyService.getFeaturedProperties().subscribe({
      next: (properties) => {
        this.featuredProjects = properties.map(prop => ({
          ...prop,
          image: prop.imagePath,
          brochure: prop.brochurePath
        }));
      },
      error: (error) => console.error('Error loading properties:', error)
    });
  }
  
  // Hero slider navigation
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }
  
  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }
  
  setCurrentSlide(index: number): void {
    this.currentSlide = index;
  }
  
  // Observe when stats section comes into view
  observeStats(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.statsAnimated = true;
            observer.disconnect();
          }
        });
      }, { threshold: 0.1 });
      
      setTimeout(() => {
        const statsSection = document.querySelector('#stats-section');
        if (statsSection) {
          observer.observe(statsSection);
        }
      }, 500);
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      setTimeout(() => {
        this.statsAnimated = true;
      }, 1000);
    }
  }
  
  // Download brochure
  downloadBrochure(projectId: number): void {
    this.featuredPropertyService.getFeaturedProperty(projectId).subscribe({
      next: (property) => {
        if (property.brochurePath) {
          const downloadUrl = `${this.featuredPropertyService.getApiUrl()}/${projectId}/brochure`;
          window.open(downloadUrl, '_blank');
        } else {
          alert('No brochure available for this project.');
        }
      },
      error: (error) => {
        console.error('Error fetching brochure:', error);
        alert('Error fetching brochure. Please try again later.');
      }
    });
  }
  
  // Enquire now
  enquireNow(projectId?: number): void {
    let message = 'Thank you for your interest!';
    if (projectId) {
      message += ` We'll contact you soon about project ${projectId}.`;
    } else {
      message += ' We\'ll contact you soon about our properties.';
    }
    alert(message);
  }
  
  // Schedule site visit
  scheduleVisit(projectId: number): void {
    alert(`Thank you for scheduling a site visit for project ${projectId}. Our team will contact you shortly.`);
  }
}
