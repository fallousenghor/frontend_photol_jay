import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-salechart',
  imports: [],
  templateUrl: './salechart.component.html',
  styleUrl: './salechart.component.scss'
})
export class SalechartComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() title: string = 'Tendances Approbations';

  chartData = [
    { month: 'Jun', approvals: 40, views: 200 },
    { month: 'Jul', approvals: 35, views: 250 },
    { month: 'Aug', approvals: 45, views: 150 },
    { month: 'Sep', approvals: 60, views: 300 },
    { month: 'Oct', approvals: 50, views: 200 },
    { month: 'Nov', approvals: 55, views: 350 },
    { month: 'Dec', approvals: 45, views: 250 }
  ];

  ngOnInit(): void {
    // Initialize chart (use Chart.js, ng2-charts, or ngx-charts)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']?.currentValue && Array.isArray(this.data) && this.data.length > 0) {
      this.chartData = this.data;
    }
  }
}
