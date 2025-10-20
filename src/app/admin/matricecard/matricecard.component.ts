import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-matricecard',
  imports: [CommonModule],
  templateUrl: './matricecard.component.html',
  styleUrl: './matricecard.component.scss'
})
export class MatricecardComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() change: number = 0;
  @Input() icon: string = '';
  @Input() period: string = '';
  @Input() subtitle: string = '';
  @Input() isRevenue: boolean = false;
  @Input() isLarge: boolean = false;

  get isPositive(): boolean {
    return this.change >= 0;
  }

  get formattedValue(): string {
    if (typeof this.value !== 'number') {
      return '0';
    }
    if (this.isRevenue || this.value > 10000) {
      return '$' + this.value.toLocaleString();
    }
    return this.value.toLocaleString();
  }
}
