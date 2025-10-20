import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminStats, PendingProduct } from '../../services/admin.service';
import { ToastService } from '../../services/toast.service';

import { ApiResponse } from '../../types/api-response';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // MatricecardComponent,
    // SalechartComponent,
    // SalerateComponent,
    // RecentComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loading = true;
  dashboardData: AdminStats['data'] | null = null;
  pendingProducts: PendingProduct[] = [];
  selectedProduct: PendingProduct | null = null;
  showRejectDialog = false;
  rejectReason = '';
  productToReject: string | null = null;

  // Propriétés pour la table des actions récentes
  searchTerm = '';
  filterType = 'all';
  sortBy = 'date';
  sortDirection = 'desc';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  filteredActions: any[] = [];

  // Méthodes pour la gestion de la table
  sort(column: string): void {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.updateFilteredActions();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updateFilteredActions();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredActions();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateFilteredActions();
    }
  }

  private updateFilteredActions(): void {
    if (!this.dashboardData?.recentModerations) return;

    let filtered = [...this.dashboardData.recentModerations];

    // Filtrage par recherche
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(action =>
        action.productTitle.toLowerCase().includes(search) ||
        action.moderatorName.toLowerCase().includes(search)
      );
    }

    // Filtrage par type
    if (this.filterType !== 'all') {
      filtered = filtered.filter(action =>
        action.action.toLowerCase() === this.filterType
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'product':
          comparison = a.productTitle.localeCompare(b.productTitle);
          break;
        case 'moderator':
          comparison = a.moderatorName.localeCompare(b.moderatorName);
          break;
        case 'action':
          comparison = a.action.localeCompare(b.action);
          break;
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        default:
          return 0;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    // Pagination
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    this.filteredActions = filtered.slice(start, start + this.pageSize);
  }

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    this.adminService.getAdminStats().subscribe({
      next: (response: AdminStats) => {
        console.log('Stats chargées:', response);
        if (response.success && response.data) {
          this.dashboardData = response.data;
        } else {
          this.dashboardData = null;
          console.warn('Pas de données de statistiques dans la réponse');
          this.toastService.show('Erreur lors du chargement des statistiques', 'error');
        }

        // Charger les produits en attente
        this.adminService.getPendingProducts().subscribe({
          next: (productsResponse: ApiResponse<PendingProduct[]>) => {
            console.log('Réponse des produits en attente:', productsResponse);
            if (productsResponse.success && productsResponse.data) {
              this.pendingProducts = productsResponse.data;
              console.log('Produits en attente mis à jour:', this.pendingProducts);
            } else {
              this.pendingProducts = [];
              console.warn('Pas de produits en attente dans la réponse');
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Erreur lors du chargement des produits en attente:', error);
            this.pendingProducts = [];
            this.loading = false;
            this.toastService.show('Erreur lors du chargement des produits en attente', 'error');
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.dashboardData = null;
        this.pendingProducts = [];
        this.loading = false;
        this.toastService.show('Erreur lors du chargement des données', 'error');
      }
    });
  }

  showProductDetails(product: PendingProduct): void {
    this.selectedProduct = product;
  }

  onApproveProduct(productId: number): void {
    this.loading = true;
    this.adminService.moderateProduct(productId, 'APPROVED').subscribe({
      next: () => {
        this.toastService.show('Produit approuvé avec succès', 'success');
        this.loadDashboardData();
        this.selectedProduct = null;
      },
      error: (error) => {
        console.error('Erreur lors de l\'approbation du produit:', error);
        this.toastService.show('Erreur lors de l\'approbation du produit', 'error');
        this.loading = false;
      }
    });
  }

  openRejectDialog(productId: number): void {
    this.productToReject = productId.toString();
    this.showRejectDialog = true;
    this.rejectReason = '';
  }

  closeRejectDialog(): void {
    this.showRejectDialog = false;
    this.rejectReason = '';
    this.productToReject = null;
  }

  confirmReject(): void {
    if (!this.rejectReason.trim() || !this.productToReject) {
      this.toastService.show('Veuillez fournir une raison pour le rejet', 'error');
      return;
    }

    this.loading = true;
    this.adminService.moderateProduct(parseInt(this.productToReject), 'REJECTED', this.rejectReason).subscribe({
      next: () => {
        this.toastService.show('Produit rejeté avec succès', 'success');
        this.closeRejectDialog();
        this.loadDashboardData();
        this.selectedProduct = null;
      },
      error: (error) => {
        console.error('Erreur lors du rejet du produit:', error);
        this.toastService.show('Erreur lors du rejet du produit', 'error');
        this.loading = false;
      }
    });
  }
}
