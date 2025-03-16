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
  
  