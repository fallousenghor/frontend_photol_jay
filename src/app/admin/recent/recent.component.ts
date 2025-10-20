import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ModerationAction {
  id: number;
  productTitle: string;
  moderatorName: string;
  action: 'APPROVED' | 'REJECTED';
  date: Date | string;
  reason?: string;
}

@Component({
  selector: 'app-recent',
  imports: [CommonModule, FormsModule],
  templateUrl: './recent.component.html',
  styleUrl: './recent.component.scss'
})
export class RecentComponent {
  @Input() recentItems: ModerationAction[] = [];
  @Input() title: string = 'Actions Récentes';

  searchTerm: string = '';
  selectedCategory: string = 'All Category';

  get filteredItems(): ModerationAction[] {
    if (!this.recentItems) return [];
    if (!this.searchTerm) return this.recentItems;
    return this.recentItems.filter(item =>
      item.productTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.moderatorName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getActionClass(action: string): string {
    return action === 'APPROVED' ? 'approved' : 'rejected';
  }
}
