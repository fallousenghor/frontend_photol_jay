export interface User {
  id: number;
  userName: string;
  email: string;
  role: 'USER' | 'MODERATEUR' | 'ADMIN';
  isVIP: boolean;
  phoneNumber: string;
  whatsappNumber?: string;
  shopLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  isVIP?: boolean;
  phoneNumber: string;
  whatsappNumber?: string;
  shopLink?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
