import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  animations: [
    trigger('fadeInUp', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(20px)'
      })),
      transition('void => *', [
        animate('0.4s ease-out')
      ])
    ]),
    trigger('staggeredFadeIn', [
      state('void', style({
        opacity: 0
      })),
      transition('void => *', [
        animate('0.5s ease-out')
      ])
    ])
  ]
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  constructor() { }

  ngOnInit(): void {
    // Initialize any footer functionality here
  }
}
