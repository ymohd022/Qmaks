import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'QMAKS';
  showSplash = true

  onSplashComplete(): void {
    this.showSplash = false
  }
}

