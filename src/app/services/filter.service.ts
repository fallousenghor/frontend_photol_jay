import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private selectedCategoryIdSubject = new BehaviorSubject<number | null>(null);
  public selectedCategoryId$ = this.selectedCategoryIdSubject.asObservable();

  constructor() { }

  setSelectedCategoryId(categoryId: number | null) {
    this.selectedCategoryIdSubject.next(categoryId);
  }

  getSelectedCategoryId(): number | null {
    return this.selectedCategoryIdSubject.value;
  }
}
