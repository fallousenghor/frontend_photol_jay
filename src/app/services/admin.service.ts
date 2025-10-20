import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../types/api-response';

export interface AdminStatsData {
  totalProducts: number;
  pendingProducts: number;
  approvedProducts: number;
  rejectedProducts: number;
  totalUsers: number;
  vipUsers: number;
  totalViews: number;
  totalModerations: number;
  recentModerations: Array<{
    id: number;
    productTitle: string;
    moderatorName: string;
    action: 'APPROVED' | 'REJECTED';
    date: Date;
    reason?: string;
  }>;
  approvalTrends: Array<{
    month: string;
    approvals: number;
    views: number;
  }>;
  viewTrends: Array<{
    month: string;
    views: number;
  }>;
}

export type AdminStats = ApiResponse<AdminStatsData>;

export interface VipUser {
  id: number;
  email: string;
  userName: string;
  isVip: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PendingProduct {
  id: number;
  title: string;
  description: string;
  user: {
    userName: string;
    email: string;
  };
  images: { url: string }[];
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/api/admin/stats`);
  }

  getPendingProducts(): Observable<ApiResponse<PendingProduct[]>> {
    return this.http.get<ApiResponse<PendingProduct[]>>(`${this.apiUrl}/api/admin/pending-products`);
  }

  moderateProduct(productId: number, action: 'APPROVED' | 'REJECTED', reason?: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/api/admin/products/${productId}/moderate`, {
      action,
      reason
    });
  }

  getVipUsers(): Observable<ApiResponse<VipUser[]>> {
    return this.http.get<ApiResponse<VipUser[]>>(`${this.apiUrl}/api/admin/vip-users`);
  }

  toggleVipStatus(userId: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/api/admin/users/${userId}/toggle-vip`, { userId });
  }

  toggleProductVipStatus(productId: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/api/admin/products/${productId}/toggle-vip`, {});
  }

  getAllProducts(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/api/admin/products`);
  }
}
