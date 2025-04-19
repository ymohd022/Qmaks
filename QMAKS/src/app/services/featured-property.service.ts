import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import  { Observable } from "rxjs"


@Injectable({
  providedIn: "root",
})
export class FeaturedPropertyService {
  private apiUrl = `http://localhost:3000/api/home/featured-properties`

  constructor(private http: HttpClient) {}

  getFeaturedProperties(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
  }

  getFeaturedProperty(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
  }

  addFeaturedProperty(propertyData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, propertyData)
  }

  updateFeaturedProperty(id: number, propertyData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, propertyData)
  }

  deleteFeaturedProperty(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
  }

  uploadBrochure(id: number, brochureData: FormData): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${id}/brochure`,
      brochureData,
      { responseType: 'json' }
    );
  }

  getApiUrl(): string {
    return this.apiUrl;
  }
}
