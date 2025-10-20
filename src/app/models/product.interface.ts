export interface ProductImage {
  id: number;
  url: string;
}

export interface Category {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: number;
  email: string;
  userName: string;
  phoneNumber: string;
  whatsappNumber?: string;
  shopLink?: string;
  // Add other user fields as needed
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number | null;
  userId: number;
  user?: User;
  categoryId?: number | null;
  category?: Category | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  priority: boolean;
  views: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  images?: ProductImage[];
}

export interface CreateProduct {
  title: string;
  description: string;
  price?: number;
  userId: number;
  categoryId?: number;
  expiresAt: Date;
}
