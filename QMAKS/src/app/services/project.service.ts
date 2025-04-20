import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import  { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { GalleryImage } from "./gallery.service"

export interface Project {
  id: number
  name: string
  title?: string // For compatibility
  location: string
  type: string
  status: string
  size: string
  completion: string
  description: string
  fullDescription: string
  thumbnailImage: string
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
  specifications: {
    [key: string]: string
  }
  features: string[]
  brochureTitle?: string
  brochurePath?: string
  brochureUrl?: string // For compatibility
  gallery?: string[] // For compatibility
  floorPlans?: string[] // For compatibility
  architecturalRenders?: string[] // For compatibility
}

export interface ProjectMedia {
  id: number
  projectId: number
  type: "photo" | "floorPlan" | "render"
  path: string
  displayOrder: number
}

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  private apiUrl = `http://localhost:3000/api/projects`

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>(this.apiUrl)
      .pipe(map((projects) => projects.map((project) => this.normalizeProject(project))))
  }

  getProject(id: string | number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`).pipe(map((project) => this.normalizeProject(project)))
  }

  getFeaturedProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>(`${this.apiUrl}/featured`)
      .pipe(map((projects) => projects.map((project) => this.normalizeProject(project))))
  }

  addProject(projectData: FormData): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, projectData).pipe(map((project) => this.normalizeProject(project)))
  }

  updateProject(id: number, projectData: FormData): Observable<Project> {
    return this.http
      .put<Project>(`${this.apiUrl}/${id}`, projectData)
      .pipe(map((project) => this.normalizeProject(project)))
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
  }

  // Project Media Management
  getProjectMedia(projectId: number): Observable<ProjectMedia[]> {
    return this.http.get<ProjectMedia[]>(`${this.apiUrl}/${projectId}/media`)
  }

  addProjectMedia(projectId: number, mediaData: FormData): Observable<ProjectMedia> {
    return this.http.post<ProjectMedia>(`${this.apiUrl}/${projectId}/media`, mediaData)
  }

  deleteProjectMedia(projectId: number, mediaId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${projectId}/media/${mediaId}`)
  }

  updateMediaOrder(projectId: number, mediaIds: number[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${projectId}/media/order`, { mediaIds })
  }

  // Brochure Management
  uploadBrochure(projectId: number, brochureData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${projectId}/brochure`, brochureData)
  }

  deleteBrochure(projectId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${projectId}/brochure`)
  }

  // Helper method to normalize project data
  private normalizeProject(project: any): Project {
    // Ensure features is always an array
    if (!project.features || typeof project.features === "string") {
      try {
        project.features = project.features ? JSON.parse(project.features) : []
      } catch (e) {
        console.error("Error parsing features:", e)
        project.features = []
      }
    }

    // Ensure specifications is always an object
    if (!project.specifications || typeof project.specifications === "string") {
      try {
        project.specifications = project.specifications ? JSON.parse(project.specifications) : {}
      } catch (e) {
        console.error("Error parsing specifications:", e)
        project.specifications = {}
      }
    }

    // Add title property for compatibility
    project.title = project.name

    // Map brochurePath to brochureUrl for compatibility
    if (project.brochurePath && !project.brochureUrl) {
      project.brochureUrl = project.brochurePath
    }

    return project
  }
}
