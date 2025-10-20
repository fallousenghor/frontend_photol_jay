import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private selectedCategoryIdSubject = new BehaviorSubject<number | null>(null);
  public selectedCategoryId$ = this.selectedCategoryIdSubject.asObservable();

  // Toggle to control whether we show all products or only the user's products
  private showAllProductsSubject = new BehaviorSubject<boolean>(false);
  public showAllProducts$ = this.showAllProductsSubject.asObservable();

  constructor() { }

  setSelectedCategoryId(categoryId: number | null) {
    this.selectedCategoryIdSubject.next(categoryId);
  }

  getSelectedCategoryId(): number | null {
    return this.selectedCategoryIdSubject.value;
  }

  setShowAllProducts(value: boolean) {
    this.showAllProductsSubject.next(value);
  }

  toggleShowAllProducts() {
    this.showAllProductsSubject.next(!this.showAllProductsSubject.value);
  }

  getShowAllProducts(): boolean {
    return this.showAllProductsSubject.value;
  }
}
