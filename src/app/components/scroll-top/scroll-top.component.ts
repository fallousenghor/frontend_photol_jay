import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="scroll-top-button"
      [class.visible]="isVisible"
      (click)="scrollToTop()"
    >
      <i class="fas fa-chevron-up"></i>
    </button>
  `,
  styles: [`
    .scroll-top-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background-color: #3498db;
      color: white;
      border: none;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;

      &.visible {
        opacity: 1;
        visibility: visible;
      }

      &:active {
        transform: scale(0.95);
        background-color: #2980b9;
      }
    }
  `]
})
export class ScrollTopComponent {
  isVisible = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isVisible = window.pageYOffset > 400;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
