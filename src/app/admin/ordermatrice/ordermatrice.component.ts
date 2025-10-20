import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PendingProduct } from '../../services/admin.service';

@Component({
  selector: 'app-ordermatrice',
  imports: [CommonModule],
  templateUrl: './ordermatrice.component.html',
  styleUrl: './ordermatrice.component.scss'
})
export class OrdermatriceComponent {
  @Input() pendingProducts: PendingProduct[] = [];
  @Output() onApprove = new EventEmitter<number>();
  @Output() onReject = new EventEmitter<number>();

  approveProduct(productId: number): void {
    this.onApprove.emit(productId);
  }

  rejectProduct(productId: number): void {
    this.onReject.emit(productId);
  }
}
