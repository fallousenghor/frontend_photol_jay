import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-salerate',
  imports: [CommonModule],
  templateUrl: './salerate.component.html',
  styleUrl: './salerate.component.scss'
})
export class SalerateComponent implements OnInit {
  @Input() percentage: number = 0;
  @Input() label: string = 'VIP Rate';

  metrics = [
    { label: 'Produits Approuvés', value: '1,245', change: 5.2, positive: true },
    { label: 'Produits Rejetés', value: '234', change: -2.1, positive: false }
  ];

  ngOnInit(): void {
    // Initialize donut chart
  }
}
