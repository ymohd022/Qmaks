import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import  { Observable } from "rxjs"

export interface Project {
  id: number
  name: string
  title: string // Added for compatibility
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
  brochureUrl?: string // Added for compatibility
  gallery?: string[] // Added for compatibility
  floorPlans?: string[] // Added for compatibility
  architecturalRenders?: string[] // Added for compatibility
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
    return this.http.get<Project[]>(this.apiUrl)
  }

  getProject(id: string | number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`)
  }

  getFeaturedProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/featured`)
  }

  addProject(projectData: FormData): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, projectData)
  }

  updateProject(id: number, projectData: FormData): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, projectData)
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
}
