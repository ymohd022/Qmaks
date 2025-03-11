import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[countUp]'
})
export class CountUpDirective implements OnInit {
  @Input('countUp') targetValue: number = 0;
  @Input() duration: number = 2; // in seconds
  @Input() useEasing: boolean = true;
  
  private startTime: number | null = null;
  private currentValue: number = 0;
  
  constructor(private el: ElementRef) {}
  
  ngOnInit() {
    // Start the animation
    requestAnimationFrame(this.animate.bind(this));
  }
  
  private animate(timestamp: number) {
    if (!this.startTime) {
      this.startTime = timestamp;
    }
    
    // Calculate progress
    const progress = Math.min((timestamp - this.startTime) / (this.duration * 1000), 1);
    
    // Apply easing if enabled
    const easedProgress = this.useEasing ? this.easeOutExpo(progress) : progress;
    
    // Calculate current value
    this.currentValue = Math.floor(easedProgress * this.targetValue);
    
    // Update element text
    this.el.nativeElement.textContent = this.currentValue;
    
    // Continue animation if not complete
    if (progress < 1) {
      requestAnimationFrame(this.animate.bind(this));
    } else {
      // Ensure final value is exactly the target
      this.el.nativeElement.textContent = this.targetValue;
    }
  }
  
  // Easing function for smoother animation
  private easeOutExpo(x: number): number {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }
}