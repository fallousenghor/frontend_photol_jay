import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  adminStats: any = {};
  pendingProducts: any[] = [];
  allProducts: any[] = [];
  selectedProduct: any = null;
  loading = true;

  // View mode
  viewMode: 'pending' | 'all' = 'pending';

  // Reject modal properties
  showRejectModal = false;
  rejectReason = '';

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  sortField: string = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  get totalItems(): number {
    return this.viewMode === 'pending' ? this.pendingProducts.length : this.allProducts.length;
  }

  get currentProducts(): any[] {
    return this.viewMode === 'pending' ? this.pendingProducts : this.allProducts;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get paginatedProducts(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.sortedProducts.slice(startIndex, endIndex);
  }

  get sortedProducts(): any[] {
    return [...this.currentProducts].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'userName':
          aValue = a.user.userName.toLowerCase();
          bValue = b.user.userName.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is admin
    if (this.authService.getRole() !== 'ADMIN') {
      this.router.navigate(['/products']);
      return;
    }

    this.loadAdminData();
  }

  loadAdminData(): void {
    this.loading = true;
    this.adminService.getAdminStats().subscribe({
      next: (response) => {
        this.adminStats = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading admin stats:', error);
        this.loading = false;
      }
    });

    this.loadProducts();
  }

  loadProducts(): void {
    if (this.viewMode === 'pending') {
      this.adminService.getPendingProducts().subscribe({
        next: (response) => {
          this.pendingProducts = response.data || [];
        },
        error: (error) => {
          console.error('Error loading pending products:', error);
        }
      });
    } else {
      this.adminService.getAllProducts().subscribe({
        next: (response) => {
          this.allProducts = response.data || [];
        },
        error: (error) => {
          console.error('Error loading all products:', error);
        }
      });
    }
  }

  switchView(mode: 'pending' | 'all'): void {
    this.viewMode = mode;
    this.loadProducts();
  }

  approveProduct(productId: number): void {
    this.adminService.moderateProduct(productId, 'APPROVED', '').subscribe({
      next: () => {
        this.loadAdminData(); // Reload data
      },
      error: (error) => {
        console.error('Error approving product:', error);
      }
    });
  }

  rejectProduct(productId: number): void {
    this.selectedProduct = this.pendingProducts.find(p => p.id === productId);
    if (this.selectedProduct) {
      this.showRejectModal = true;
    }
  }

  confirmReject(): void {
    if (this.selectedProduct && this.rejectReason.trim()) {
      this.adminService.moderateProduct(this.selectedProduct.id, 'REJECTED', this.rejectReason.trim()).subscribe({
        next: () => {
          this.loadAdminData(); // Reload data
          this.closeRejectModal();
        },
        error: (error) => {
          console.error('Error rejecting product:', error);
        }
      });
    }
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.selectedProduct = null;
    this.rejectReason = '';
  }

  toggleProductVip(productId: number): void {
    this.adminService.toggleProductVipStatus(productId).subscribe({
      next: () => {
        this.loadAdminData(); // Reload data to reflect changes
      },
      error: (error) => {
        console.error('Error toggling product VIP status:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  trackByProductId(index: number, product: any): number {
    return product.id;
  }

  viewProductDetails(product: any): void {
    this.selectedProduct = product;
  }

  closeModal(): void {
    this.selectedProduct = null;
  }

  // Pagination methods
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Sorting methods
  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.currentPage = 1; // Reset to first page when sorting
  }

  // Utility methods for template
  min(a: number, b: number): number {
    return Math.min(a, b);
  }
}
