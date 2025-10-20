import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { NavbarComponent } from '../pages/navbar/navbar.component';
import { FilterService } from '../services/filter.service';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <app-header
        (searchChanged)="onSearch($event)"
        (categorySelected)="onCategorySelect($event)">
    </app-header>
    <router-outlet></router-outlet>
  `
})
export class DefaultLayoutComponent {
  constructor(private filterService: FilterService) {}

  onSearch(searchTerm: string) {
    console.log('Recherche:', searchTerm);
    // TODO: Implement search logic
  }

  onCategorySelect(categoryId: number | null) {
    console.log('Catégorie sélectionnée:', categoryId);
    this.filterService.setSelectedCategoryId(categoryId);
  }
}
