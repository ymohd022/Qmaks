import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import {  Observable, of, throwError } from "rxjs"
import { catchError } from "rxjs/operators"


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl: string =  'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`).pipe(
      catchError((error) => {
        console.error("Error fetching dashboard stats", error)
        return throwError(() => error)
      }),
    )
  }

  // For demo purposes, you can use this method to get sample data
  // Remove this in production and use the real API method
  getSampleDashboardStats(): Observable<any> {
    const sampleData = {
      stats: {
        totalProjects: 12,
        completedProjects: 5,
        ongoingProjects: 4,
        upcomingProjects: 3,
        totalGalleryItems: 86,
        totalBrochures: 9,
      },
      recentActivities: [
        { type: "upload", user: "Admin", item: "New hero image", timestamp: new Date(Date.now() - 3600000) },
        { type: "edit", user: "Admin", item: "Royal Heights project", timestamp: new Date(Date.now() - 86400000) },
        { type: "delete", user: "Admin", item: "Outdated brochure", timestamp: new Date(Date.now() - 172800000) },
        { type: "upload", user: "Admin", item: "New gallery images", timestamp: new Date(Date.now() - 259200000) },
      ],
      projectsByType: [
        { type: "Residential", count: 6 },
        { type: "Commercial", count: 3 },
        { type: "Industrial", count: 2 },
        { type: "Mixed-use", count: 1 },
      ],
      uploadsByMonth: [
        { month: "Jan", images: 12, videos: 3, brochures: 1 },
        { month: "Feb", images: 19, videos: 5, brochures: 2 },
        { month: "Mar", images: 8, videos: 2, brochures: 1 },
        { month: "Apr", images: 15, videos: 4, brochures: 3 },
        { month: "May", images: 20, videos: 6, brochures: 1 },
        { month: "Jun", images: 12, videos: 3, brochures: 1 },
      ],
    }

    return of(sampleData)
  }
}
