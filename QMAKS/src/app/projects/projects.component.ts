import { Component,  OnInit } from "@angular/core"
import { ProjectService, Project } from "../services/project.service"

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  ongoingProjects: Project[] = []
  completedProjects: Project[] = []
  loading = true
  activeTab = "all"

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects()
  }

  loadProjects(): void {
    this.loading = true
    this.projectService.getProjects().subscribe(
      (projects: Project[]) => {
        this.ongoingProjects = projects.filter((project) => project.status === "ongoing")
        this.completedProjects = projects.filter((project) => project.status === "completed")
        this.loading = false
      },
      (error) => {
        console.error("Error loading projects:", error)
        this.loading = false
      },
    )
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab
  }
}
