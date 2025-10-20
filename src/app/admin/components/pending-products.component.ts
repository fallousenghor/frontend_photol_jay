import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, PendingProduct } from '../../services/admin.service';
import { ApiResponse } from '../../types/api-response';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-pending-products',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Produits en attente de modération</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let product of pendingProducts" class="bg-white rounded-lg shadow-md p-4">
          <div class="relative pb-2/3">
            <img [src]="product.images[0]?.url" alt="{{product.title}}" class="absolute h-full w-full object-cover rounded-t-lg">
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">{{product.title}}</h3>
            <p class="text-gray-600 mb-2">{{product.description}}</p>
            <p class="text-sm text-gray-500 mb-4">
              Posté par: {{product.user.userName}}
              <br>
              Le: {{product.createdAt | date}}
            </p>

            <div class="flex space-x-2">
              <button (click)="approveProduct(product.id)"
                      class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                Approuver
              </button>
              <button (click)="openRejectDialog(product.id)"
                      class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                Rejeter
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Dialog de rejet -->
      <div *ngIf="showRejectDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg max-w-md w-full">
          <h3 class="text-lg font-semibold mb-4">Raison du rejet</h3>
          <textarea [(ngModel)]="rejectReason"
                    class="w-full p-2 border rounded mb-4"
                    placeholder="Entrez la raison du rejet..."></textarea>
          <div class="flex justify-end space-x-2">
            <button (click)="showRejectDialog = false"
                    class="px-4 py-2 border rounded">
              Annuler
            </button>
            <button (click)="rejectProduct()"
                    class="px-4 py-2 bg-red-500 text-white rounded">
              Confirmer le rejet
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PendingProductsComponent implements OnInit {
  pendingProducts: PendingProduct[] = [];
  showRejectDialog = false;
  rejectReason = '';
  selectedProductId: number | null = null;

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadPendingProducts();
  }

  loadPendingProducts() {
    this.adminService.getPendingProducts().subscribe({
      next: (response: ApiResponse<PendingProduct[]>) => {
        if (response.success) {
          this.pendingProducts = response.data || [];
        } else {
          this.toastService.show('Erreur lors du chargement des produits en attente', 'error');
        }
      },
      error: (error) => {
        this.toastService.show('Erreur lors du chargement des produits en attente', 'error');
      }
    });
  }

  approveProduct(productId: number) {
    this.adminService.moderateProduct(productId, 'APPROVED').subscribe({
      next: (response: ApiResponse<void>) => {
        if (response.success) {
          this.toastService.show('Produit approuvé avec succès', 'success');
          this.loadPendingProducts();
        }
      },
      error: (error: unknown) => {
        this.toastService.show('Erreur lors de l\'approbation du produit', 'error');
      }
    });
  }

  openRejectDialog(productId: number) {
    this.selectedProductId = productId;
    this.showRejectDialog = true;
    this.rejectReason = '';
  }

  rejectProduct() {
    if (!this.selectedProductId) return;

    this.adminService.moderateProduct(this.selectedProductId, 'REJECTED', this.rejectReason).subscribe({
      next: (response: ApiResponse<void>) => {
        if (response.success) {
          this.toastService.show('Produit rejeté avec succès', 'success');
          this.loadPendingProducts();
          this.showRejectDialog = false;
          this.rejectReason = '';
          this.selectedProductId = null;
        }
      },
      error: (error: unknown) => {
        this.toastService.show('Erreur lors du rejet du produit', 'error');
      }
    });
  }
}
