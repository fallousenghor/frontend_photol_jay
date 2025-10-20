import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-container" *ngIf="show">
      <div class="loader"></div>
    </div>
  `,
  styles: [`
    .loader-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }

    .loader {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoaderComponent {
  @Input() show: boolean = false;
}
