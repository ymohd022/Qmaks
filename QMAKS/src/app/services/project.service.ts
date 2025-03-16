import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import {  Observable, of } from "rxjs"

export interface Project {
  id: string
  title: string
  location: string
  size: string
  status: "ongoing" | "completed"
  description: string
  fullDescription: string
  thumbnailImage: string
  gallery: string[]
  floorPlans: string[]
  architecturalRenders: string[]
  brochureUrl: string
  specifications: {
    [key: string]: string
  }
  features: string[]
}

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  // Mock data for projects
  private mockProjects: Project[] = [
    {
      id: "1",
      title: "Modern Residential Complex",
      location: "Riyadh, Saudi Arabia",
      size: "25,000 sq.m",
      status: "ongoing",
      description: "A luxury residential complex featuring modern architecture and premium amenities.",
      fullDescription:
        "This luxury residential complex is designed to provide an exceptional living experience with a perfect blend of modern architecture and premium amenities. The project features spacious apartments, landscaped gardens, and state-of-the-art facilities. Located in a prime area of Riyadh, the complex offers convenient access to major highways, shopping centers, and educational institutions.",
      thumbnailImage: "assets/projects/project1-thumb.jpg",
      gallery: [
        "/HASEEB RESIDENCY.png",
        "assets/projects/project1-gallery2.jpg",
        "assets/projects/project1-gallery3.jpg",
        "assets/projects/project1-gallery4.jpg",
        "assets/projects/project1-gallery5.jpg",
        "assets/projects/project1-gallery6.jpg",
      ],
      floorPlans: [
        "assets/projects/project1-plan1.jpg",
        "assets/projects/project1-plan2.jpg",
        "assets/projects/project1-plan3.jpg",
      ],
      architecturalRenders: [
        "assets/projects/project1-render1.jpg",
        "assets/projects/project1-render2.jpg",
        "assets/projects/project1-render3.jpg",
      ],
      brochureUrl: "/HASEEB RESIDENCY BROUCHURE(.pdf",
      specifications: {
        "Project Type": "Residential Complex",
        "Total Area": "25,000 sq.m",
        "Number of Units": "120 Apartments",
        "Unit Types": "1BR, 2BR, 3BR, Penthouses",
        Parking: "Underground Parking for 200 Cars",
        "Construction Start": "January 2023",
        "Expected Completion": "December 2025",
        "Structure Type": "Reinforced Concrete",
        "Exterior Finish": "Glass and Aluminum Composite Panels",
      },
      features: [
        "Swimming Pool and Jacuzzi",
        "Fully Equipped Gym",
        "Children's Play Area",
        "Landscaped Gardens",
        "Community Center",
        "Smart Home Technology",
        "24/7 Security System",
        "Rooftop Lounge",
        "Electric Vehicle Charging Stations",
        "Sustainable Design Features",
      ],
    },
    {
      id: "2",
      title: "Commercial Office Tower",
      location: "Jeddah, Saudi Arabia",
      size: "40,000 sq.m",
      status: "ongoing",
      description: "A state-of-the-art commercial office tower with sustainable design features.",
      fullDescription:
        "This state-of-the-art commercial office tower is designed to meet the needs of modern businesses while incorporating sustainable design features. The tower offers flexible office spaces, advanced technological infrastructure, and energy-efficient systems. Located in the business district of Jeddah, it provides excellent connectivity and visibility for businesses.",
      thumbnailImage: "assets/projects/project2-thumb.jpg",
      gallery: [
        "assets/projects/project2-gallery1.jpg",
        "assets/projects/project2-gallery2.jpg",
        "assets/projects/project2-gallery3.jpg",
        "assets/projects/project2-gallery4.jpg",
      ],
      floorPlans: ["assets/projects/project2-plan1.jpg", "assets/projects/project2-plan2.jpg"],
      architecturalRenders: ["assets/projects/project2-render1.jpg", "assets/projects/project2-render2.jpg"],
      brochureUrl: "assets/brochures/project2-brochure.pdf",
      specifications: {
        "Project Type": "Commercial Office Tower",
        "Total Area": "40,000 sq.m",
        "Number of Floors": "25 Floors",
        "Office Space": "30,000 sq.m",
        "Retail Space": "5,000 sq.m",
        Parking: "Multi-level Parking for 500 Cars",
        "Construction Start": "March 2022",
        "Expected Completion": "June 2025",
        "Structure Type": "Steel and Reinforced Concrete",
        "Exterior Finish": "Curtain Wall with High-Performance Glass",
      },
      features: [
        "High-speed Elevators",
        "Advanced Building Management System",
        "Fiber Optic Connectivity",
        "Conference and Meeting Facilities",
        "Retail Spaces on Ground Floor",
        "Rooftop Garden",
        "Energy-efficient HVAC System",
        "Rainwater Harvesting",
        "Solar Panels",
        "LEED Gold Certification Target",
      ],
    },
    {
      id: "3",
      title: "Luxury Hotel & Resort",
      location: "Dammam, Saudi Arabia",
      size: "35,000 sq.m",
      status: "completed",
      description: "A five-star luxury hotel and resort with world-class amenities and beachfront access.",
      fullDescription:
        "This five-star luxury hotel and resort offers world-class amenities and direct beachfront access. The project features elegantly designed rooms and suites, multiple dining options, spa facilities, and recreational areas. Located along the beautiful coastline of Dammam, the resort provides a perfect blend of luxury, comfort, and natural beauty for an unforgettable guest experience.",
      thumbnailImage: "assets/projects/project3-thumb.jpg",
      gallery: [
        "assets/projects/project3-gallery1.jpg",
        "assets/projects/project3-gallery2.jpg",
        "assets/projects/project3-gallery3.jpg",
        "assets/projects/project3-gallery4.jpg",
        "assets/projects/project3-gallery5.jpg",
      ],
      floorPlans: [
        "assets/projects/project3-plan1.jpg",
        "assets/projects/project3-plan2.jpg",
        "assets/projects/project3-plan3.jpg",
      ],
      architecturalRenders: [
        "assets/projects/project3-render1.jpg",
        "assets/projects/project3-render2.jpg",
        "assets/projects/project3-render3.jpg",
        "assets/projects/project3-render4.jpg",
      ],
      brochureUrl: "assets/brochures/project3-brochure.pdf",
      specifications: {
        "Project Type": "Luxury Hotel & Resort",
        "Total Area": "35,000 sq.m",
        "Number of Rooms": "250 Rooms and Suites",
        Restaurants: "5 Restaurants and Lounges",
        "Conference Space": "2,000 sq.m",
        Parking: "Valet and Self-parking for 300 Cars",
        "Construction Start": "September 2019",
        Completion: "December 2022",
        "Structure Type": "Reinforced Concrete",
        "Exterior Finish": "Natural Stone and Glass",
      },
      features: [
        "Private Beach Access",
        "Infinity Pool with Ocean View",
        "Luxury Spa and Wellness Center",
        "Fine Dining Restaurants",
        "Ballroom and Event Spaces",
        "Water Sports Facilities",
        "Kids Club",
        "Fitness Center",
        "Business Center",
        "Concierge Services",
      ],
    },
  ]

  constructor(private http: HttpClient) {}

  // Get all projects
  getProjects(): Observable<Project[]> {
    return of(this.mockProjects)
  }

  // Get a single project by ID
  getProject(id: string): Observable<Project> {
    const project = this.mockProjects.find((p) => p.id === id)
    if (project) {
      return of(project)
    } else {
      throw new Error("Project not found")
    }
  }

  // Get filter options for projects
  getFilterOptions(): Observable<any> {
    return of({
      types: ["Residential", "Commercial", "Industrial", "Hospitality"],
      statuses: ["ongoing", "completed"],
      locations: ["Riyadh, Saudi Arabia", "Jeddah, Saudi Arabia", "Dammam, Saudi Arabia"],
      tags: ["Luxury", "Modern", "Sustainable", "Office", "Retail", "Hotel", "Resort"],
    })
  }
}

