import { Component,  OnInit } from "@angular/core"
import { ProjectService } from "../../services/project.service"

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrl: './sitemap.component.css'
})
export class SitemapComponent implements OnInit {
  projects: any[] = []
  loading = false

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loading = true
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading projects for sitemap:", error)
        this.loading = false
      },
    })
  }
}