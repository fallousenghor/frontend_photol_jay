import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { LoaderComponent } from '../../components/loader/loader.component';
import { UiService } from '../../services/ui.service';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { ImageService } from '../../services/image.service';
import { AuthService } from '../../services/auth.service';
import { DEFAULT_IMAGE_BASE64 } from '../../constants/images';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, LoaderComponent, CurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  currentImageIndex = 0;
  isLoggedIn = false;
  currentUserId?: number;
  isOwner = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private uiService: UiService,
    public imageService: ImageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Initialize auth state
    this.isLoggedIn = !!this.authService.getToken();
    this.currentUserId = this.authService.getUserId() || undefined;

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProduct(id).subscribe({
        next: (product) => {
          this.product = product || null;
          this.isLoading = false;
          if (!product) {
            this.uiService.showError('Produit non trouvé');
            this.router.navigate(['/products']);
          } else {
            // Check if current user is the owner
            this.isOwner = this.isLoggedIn && this.currentUserId === product.userId;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.uiService.showError('Erreur lors du chargement du produit');
          this.router.navigate(['/products']);
        }
      });
    } else {
      this.uiService.showError('ID de produit manquant');
      this.router.navigate(['/products']);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  getPrice(): number {
    return this.product?.price || 0;
  }

  getWhatsAppLink(phone: string): string {
    return 'https://wa.me/' + phone.replace(/\D/g, '');
  }

  nextImage(): void {
    if (this.product && this.product.images && this.product.images.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
    }
  }

  prevImage(): void {
    if (this.product && this.product.images && this.product.images.length > 1) {
      this.currentImageIndex = this.currentImageIndex === 0 ? this.product.images.length - 1 : this.currentImageIndex - 1;
    }
  }

  getCurrentImageUrl(): string {
    if (this.product && this.product.images && this.product.images.length > 0) {
      return this.imageService.getImageUrl(this.product.images[this.currentImageIndex].url);
    }
    return DEFAULT_IMAGE_BASE64;
  }

  hasMultipleImages(): boolean {
    return this.product ? (this.product.images?.length || 0) > 1 : false;
  }

  editProduct(): void {
    if (this.product) {
      this.router.navigate(['/add-product'], {
        queryParams: { edit: this.product.id }
      });
    }
  }
}
