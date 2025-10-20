import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiService, Toast } from '../../services/ui.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="toast" [@toastAnimation]>
      <div class="toast" [class]="toast.type">
        {{ toast.message }}
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1100;
    }

    .toast {
      padding: 12px 24px;
      border-radius: 8px;
      color: white;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 200px;
      text-align: center;
    }

    .success {
      background-color: #2ecc71;
    }

    .error {
      background-color: #e74c3c;
    }

    .info {
      background-color: #3498db;
    }
  `]
})
export class ToastComponent implements OnInit {
  toast: Toast | null = null;

  constructor(private uiService: UiService) {}

  ngOnInit(): void {
    this.uiService.toast$.subscribe(toast => {
      this.toast = toast;
    });
  }
}
