import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.interface';
import { ImageService } from '../../services/image.service';
import { DEFAULT_IMAGE_BASE64 } from '../../constants/images';
import { CfaPipe } from '../../pipes/cfa.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CfaPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() viewDetailsClicked = new EventEmitter<Product>();
  @Output() favoriteClicked = new EventEmitter<Product>();

  constructor(private imageService: ImageService) {}

  isFavorite = false;

  get imageUrl(): string {
    if (this.product.images && this.product.images.length > 0) {
      return this.imageService.getImageUrl(this.product.images[0].url);
    }
    return DEFAULT_IMAGE_BASE64;
  }

  getOriginalPrice(): number {
    const price = this.product.price || 0;
    return price; // No discount in backend, so original price is the price
  }

  getPrice(): number {
    return this.product.price || 0;
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
    this.favoriteClicked.emit(this.product);
  }

  viewDetails(): void {
    this.viewDetailsClicked.emit(this.product);
  }
}
