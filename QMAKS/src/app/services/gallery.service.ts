import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import  { Observable } from "rxjs"
import { map } from "rxjs/operators"
import  { ProjectService } from "./project.service"

export interface GalleryImage {
  id: number
  projectId: number
  type: "building" | "interior" | "video"
  url: string
  caption: string
  displayOrder: number
  thumbnailUrl?: string
}

@Injectable({
  providedIn: "root",
})
export class GalleryService {
  private apiUrl = "http://localhost:3000/api/gallery"

  constructor(
    private http: HttpClient,
    private projectService: ProjectService,
  ) {}

  // Get all gallery images
  getGalleryImages(): Observable<GalleryImage[]> {
    return this.http.get<GalleryImage[]>(this.apiUrl).pipe(
      map((images) => {
        return images.map((image) => this.normalizeGalleryImage(image))
      }),
    )
  }

  // Get gallery images by project ID
  getGalleryImagesByProject(projectId: number): Observable<GalleryImage[]> {
    return this.http.get<GalleryImage[]>(`${this.apiUrl}/project/${projectId}`).pipe(
      map((images) => {
        return images.map((image) => this.normalizeGalleryImage(image))
      }),
    )
  }

  // Add a new gallery image
  addGalleryImage(formData: FormData): Observable<GalleryImage> {
    return this.http.post<GalleryImage>(this.apiUrl, formData).pipe(map((image) => this.normalizeGalleryImage(image)))
  }

  // Update gallery image
  updateGalleryImage(id: number, formData: FormData): Observable<GalleryImage> {
    return this.http
      .put<GalleryImage>(`${this.apiUrl}/${id}`, formData)
      .pipe(map((image) => this.normalizeGalleryImage(image)))
  }

  // Delete gallery image
  deleteGalleryImage(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
  }

  // Update display order of gallery images
  updateGalleryOrder(projectId: number, imageIds: number[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/order`, { projectId, imageIds })
  }

  // Helper method to normalize gallery image data
  private normalizeGalleryImage(image: any): GalleryImage {
    // Generate thumbnail URL for videos if not provided
    if (image.type === "video" && !image.thumbnailUrl) {
      image.thumbnailUrl = image.url.replace(/\.[^/.]+$/, "_thumbnail.jpg")
    }

    return image
  }
}
