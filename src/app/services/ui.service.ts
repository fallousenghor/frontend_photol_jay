import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private toastSubject = new BehaviorSubject<Toast | null>(null);
  toast$ = this.toastSubject.asObservable();

  showToast(toast: Toast): void {
    this.toastSubject.next(toast);
    setTimeout(() => {
      this.toastSubject.next(null);
    }, toast.duration || 3000);
  }

  showSuccess(message: string): void {
    this.showToast({ message, type: 'success' });
  }

  showError(message: string): void {
    this.showToast({ message, type: 'error' });
  }

  showInfo(message: string): void {
    this.showToast({ message, type: 'info' });
  }
}
