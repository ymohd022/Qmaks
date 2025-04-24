import { Component } from '@angular/core';

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styleUrl: './terms-of-use.component.css'
})
export class TermsOfUseComponent {
  // Current date for the last updated field
  lastUpdated = new Date("2023-12-01")
}
