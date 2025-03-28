import { Component, type OnInit, Output, EventEmitter } from "@angular/core"
import { trigger, state, style, animate, transition, query, stagger } from "@angular/animations"

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.css',
  animations: [
    trigger("logoAnimation", [
      state("initial", style({ opacity: 0, transform: "scale(0.5)" })),
      state("visible", style({ opacity: 1, transform: "scale(1)" })),
      state("exit", style({ opacity: 0, transform: "scale(1.5)" })),
      transition("initial => visible", [animate("0.8s cubic-bezier(0.34, 1.56, 0.64, 1)")]),
      transition("visible => exit", [animate("0.6s cubic-bezier(0.34, 1.56, 0.64, 1)")]),
    ]),

    trigger("buildingAnimation", [
      state("initial", style({ opacity: 0, transform: "translateY(50px)" })),
      state("visible", style({ opacity: 1, transform: "translateY(0)" })),
      transition("initial => visible", [animate("0.8s 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)")]),
    ]),

    trigger("craneAnimation", [
      state("initial", style({ opacity: 0, transform: "translateY(-50px) rotate(-10deg)" })),
      state("visible", style({ opacity: 1, transform: "translateY(0) rotate(0deg)" })),
      transition("initial => visible", [animate("1s 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)")]),
    ]),

    trigger("textAnimation", [
      transition("initial => visible", [
        query(".text-char", [
          style({ opacity: 0, transform: "translateY(20px)" }),
          stagger(0.1, [
            animate("0.5s cubic-bezier(0.34, 1.56, 0.64, 1)", style({ opacity: 1, transform: "translateY(0)" })),
          ]),
        ]),
      ]),
    ]),

    trigger("taglineAnimation", [
      state("initial", style({ opacity: 0, transform: "translateY(20px)" })),
      state("visible", style({ opacity: 1, transform: "translateY(0)" })),
      transition("initial => visible", [animate("0.6s 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)")]),
    ]),

    trigger("backgroundAnimation", [
      state("initial", style({ transform: "scale(1.1)" })),
      state("animate", style({ transform: "scale(1)" })),
      state("exit", style({ opacity: 0 })),
      transition("initial => animate", [animate("6s ease-out")]),
      transition("animate => exit", [animate("0.8s ease-in")]),
    ]),

    trigger("progressAnimation", [
      transition("* => *", [style({ width: "0%" }), animate("5.5s ease-in-out", style({ width: "100%" }))]),
    ]),
  ],
})
export class SplashScreenComponent implements OnInit {
  @Output() splashComplete = new EventEmitter<boolean>()

  logoState = "initial"
  buildingState = "initial"
  craneState = "initial"
  textState = "initial"
  taglineState = "initial"
  backgroundState = "initial"

  // Text animation
  companyName = "QMAKS"
  companyNameChars: string[] = []

  constructor() {
    this.companyNameChars = this.companyName.split("")
  }

  ngOnInit(): void {
    // Start animation sequence
    setTimeout(() => {
      this.backgroundState = "animate"
      this.logoState = "visible"
      this.buildingState = "visible"
      this.craneState = "visible"
      this.textState = "visible"
      this.taglineState = "visible"

      // End animation sequence
      setTimeout(() => {
        this.logoState = "exit"
        this.backgroundState = "exit"

        // Emit event to show main content
        setTimeout(() => {
          this.splashComplete.emit(true)
        }, 800)
      }, 5200)
    }, 100)
  }
}
