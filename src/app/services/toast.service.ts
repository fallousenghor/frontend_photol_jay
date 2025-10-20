import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const config: MatSnackBarConfig = {
      duration: 3000,
      horizontalPosition: 'end' as MatSnackBarHorizontalPosition,
      verticalPosition: 'top' as MatSnackBarVerticalPosition,
      panelClass: [`toast-${type}`]
    };

    this.snackBar.open(message, 'Fermer', config);
  }
}
