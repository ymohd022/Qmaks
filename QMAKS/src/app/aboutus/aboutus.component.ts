import { Component, type OnInit } from "@angular/core"

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent  implements OnInit {
  // Company milestones data
  milestones = [
    {
      year: 2010,
      title: "Company Founded",
      description: "QMAKS was founded with a vision to provide innovative construction solutions.",
      icon: "business",
    },
    {
      year: 2012,
      title: "First Major Project",
      description: "Completed our first major commercial project, establishing our reputation in the industry.",
      icon: "domain",
    },
    {
      year: 2015,
      title: "Expansion to New Markets",
      description: "Expanded operations to include residential and industrial construction projects.",
      icon: "trending_up",
    },
    {
      year: 2017,
      title: "ISO Certification",
      description: "Received ISO 9001:2015 certification for our quality management systems.",
      icon: "verified",
    },
    {
      year: 2019,
      title: "Sustainability Award",
      description: "Recognized for our commitment to sustainable construction practices.",
      icon: "eco",
    },
    {
      year: 2021,
      title: "Digital Transformation",
      description: "Implemented cutting-edge digital solutions to enhance project management and client experience.",
      icon: "computer",
    },
    {
      year: 2023,
      title: "Community Impact Award",
      description: "Honored for our contributions to community development and social responsibility initiatives.",
      icon: "people",
    },
  ]

  // Team members data
  teamMembers = [
    {
      name: "Eng. Qasim Makkawi",
      position: "Founder & CEO",
      bio: "With over 25 years of experience in the construction industry, Eng. Qasim has led QMAKS to become a leader in innovative construction solutions.",
      image: "profile.png",
    },
    {
      name: "Eng. Ahmed Al-Harbi",
      position: "Chief Operations Officer",
      bio: "Eng. Ahmed oversees all operational aspects of QMAKS, ensuring projects are delivered on time and to the highest standards.",
      image: "profile.png",
    },
    {
      name: "Dr. Sarah Al-Otaibi",
      position: "Chief Technical Officer",
      bio: "Dr. Sarah brings her extensive knowledge in structural engineering to lead our technical team in developing innovative construction methodologies.",
      image: "profile.png",
    },
    {
      name: "Mohammed Al-Qahtani",
      position: "Chief Financial Officer",
      bio: "Mohammed ensures the financial health of QMAKS, managing investments and financial strategies for sustainable growth.",
      image: "profile.png",
    },
  ]

  // Customer satisfaction metrics
  satisfactionMetrics = [
    { metric: "Client Satisfaction", value: 98, icon: "sentiment_very_satisfied" },
    { metric: "Projects Completed On Time", value: 95, icon: "schedule" },
    { metric: "Quality Assurance Rating", value: 99, icon: "verified" },
    { metric: "Repeat Business Rate", value: 85, icon: "repeat" },
  ]

  // Community initiatives
  communityInitiatives = [
    {
      title: "Educational Support Program",
      description: "Providing scholarships and training opportunities for engineering students.",
      image: "assets/community/education.jpg",
    },
    {
      title: "Environmental Conservation",
      description: "Leading initiatives to reduce construction waste and promote sustainable building practices.",
      image: "assets/community/environment.jpg",
    },
    {
      title: "Housing for Underprivileged",
      description: "Partnering with local NGOs to provide housing solutions for underprivileged communities.",
      image: "assets/community/housing.jpg",
    },
  ]

  constructor() {}

  ngOnInit(): void {
    // Animation for counters can be initialized here if needed
  }
}

