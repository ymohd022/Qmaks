import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import  { Observable } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class HeroImageService {
  private apiUrl = `http://localhost:3000/home/hero-images`

  constructor(private http: HttpClient) {}

  getHeroImages(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
  }

  getHeroImage(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
  }

  addHeroImage(heroImageData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, heroImageData)
  }

  updateHeroImage(id: number, heroImageData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, heroImageData)
  }

  deleteHeroImage(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
  }
}

