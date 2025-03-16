import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { ChartOptions } from 'chart.js';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  
  // Chart options
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  // Dashboard stats
  stats = {
    totalProjects: 0,
    completedProjects: 0,
    ongoingProjects: 0,
    upcomingProjects: 0,
    totalGalleryItems: 0,
    totalBrochures: 0,
  }

  // Recent activities
  recentActivities: any[] = []

  // Charts data
  projectsByStatusData: any
  projectsByTypeData: any
  uploadsByMonthData: any

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData()
  }

  loadDashboardData(): void {
    this.isLoading = true

    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data.stats
        this.recentActivities = data.recentActivities

        // Setup chart data
        this.setupCharts(data)

        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading dashboard data", error)
        this.isLoading = false

        // Fallback to sample data for demo
        this.loadSampleData()
      },
    })
  }

  setupCharts(data: any): void {
    // Projects by status chart
    this.projectsByStatusData = {
      labels: ["Completed", "Ongoing", "Upcoming"],
      datasets: [
        {
          data: [data.stats.completedProjects, data.stats.ongoingProjects, data.stats.upcomingProjects],
          backgroundColor: ["#4caf50", "#2196f3", "#ff9800"],
        },
      ],
    }

    // Projects by type chart
    this.projectsByTypeData = {
      labels: data.projectsByType.map((item: any) => item.type),
      datasets: [
        {
          data: data.projectsByType.map((item: any) => item.count),
          backgroundColor: ["#002f6c", "#d4af37", "#4caf50", "#9c27b0"],
        },
      ],
    }

    // Uploads by month chart
    this.uploadsByMonthData = {
      labels: data.uploadsByMonth.map((item: any) => item.month),
      datasets: [
        {
          label: "Images",
          data: data.uploadsByMonth.map((item: any) => item.images),
          borderColor: "#2196f3",
          backgroundColor: "rgba(33, 150, 243, 0.2)",
          tension: 0.4,
        },
        {
          label: "Videos",
          data: data.uploadsByMonth.map((item: any) => item.videos),
          borderColor: "#ff9800",
          backgroundColor: "rgba(255, 152, 0, 0.2)",
          tension: 0.4,
        },
        {
          label: "Brochures",
          data: data.uploadsByMonth.map((item: any) => item.brochures),
          borderColor: "#4caf50",
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          tension: 0.4,
        },
      ],
    }
  }

  loadSampleData(): void {
    // Sample stats
    this.stats = {
      totalProjects: 12,
      completedProjects: 5,
      ongoingProjects: 4,
      upcomingProjects: 3,
      totalGalleryItems: 86,
      totalBrochures: 9,
    }

    // Sample recent activities
    this.recentActivities = [
      { type: "upload", user: "Admin", item: "New hero image", timestamp: new Date(Date.now() - 3600000) },
      { type: "edit", user: "Admin", item: "Royal Heights project", timestamp: new Date(Date.now() - 86400000) },
      { type: "delete", user: "Admin", item: "Outdated brochure", timestamp: new Date(Date.now() - 172800000) },
      { type: "upload", user: "Admin", item: "New gallery images", timestamp: new Date(Date.now() - 259200000) },
    ]

    // Sample chart data
    this.projectsByStatusData = {
      labels: ["Completed", "Ongoing", "Upcoming"],
      datasets: [
        {
          data: [5, 4, 3],
          backgroundColor: ["#4caf50", "#2196f3", "#ff9800"],
        },
      ],
    }

    this.projectsByTypeData = {
      labels: ["Residential", "Commercial", "Industrial", "Mixed-use"],
      datasets: [
        {
          data: [6, 3, 2, 1],
          backgroundColor: ["#002f6c", "#d4af37", "#4caf50", "#9c27b0"],
        },
      ],
    }

    this.uploadsByMonthData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Images",
          data: [12, 19, 8, 15, 20, 12],
          borderColor: "#2196f3",
          backgroundColor: "rgba(33, 150, 243, 0.2)",
          tension: 0.4,
        },
        {
          label: "Videos",
          data: [3, 5, 2, 4, 6, 3],
          borderColor: "#ff9800",
          backgroundColor: "rgba(255, 152, 0, 0.2)",
          tension: 0.4,
        },
        {
          label: "Brochures",
          data: [1, 2, 1, 3, 1, 1],
          borderColor: "#4caf50",
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          tension: 0.4,
        },
      ],
    }
  }
}