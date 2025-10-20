import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/product.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() searchChanged = new EventEmitter<string>();
  @Output() categorySelected = new EventEmitter<number | null>();

  searchTerm: string = '';
  selectedCategoryId: number | null = null;
  showCategories: boolean = false;
  categories: Category[] = [];
  private subscription: Subscription = new Subscription();

  categoriesList: string[] = [
    'all',
    'vip',
    'récent',
    'populaire'
  ];

  private readonly categoryCounts: { [key: string]: number } = {
    'all': 150,
    'vip': 25,
    'récent': 45,
    'populaire': 78
  };

  private readonly categoryIcons: { [key: string]: string } = {
    'all': 'fa-th-large',
    'vip': 'fa-crown',
    'récent': 'fa-clock',
    'populaire': 'fa-fire'
  };

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadCategories(): void {
    this.subscription.add(
      this.categoryService.getCategories().subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
        }
      })
    );
  }

  getCategoryIcon(category: string): string {
    return this.categoryIcons[category] || 'fa-folder';
  }

  getCategoryCount(category: string): number {
    return this.categoryCounts[category] || 0;
  }



  onSearchChange(): void {
    this.searchChanged.emit(this.searchTerm);
  }

  toggleCategories(): void {
    this.showCategories = !this.showCategories;
  }

  selectCategory(categoryName: string): void {
    // Handle static categories
    if (categoryName === 'all') {
      this.selectedCategoryId = null;
    } else {
      // For static categories that don't have IDs, keep as null
      // For dynamic categories, find the category by name
      const dynamicCategory = this.categories.find(cat => cat.name === categoryName);
      this.selectedCategoryId = dynamicCategory ? dynamicCategory.id : null;
    }

    this.showCategories = false;
    this.categorySelected.emit(this.selectedCategoryId);
  }
}
