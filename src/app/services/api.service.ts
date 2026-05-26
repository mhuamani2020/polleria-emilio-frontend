import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

const API = environment.apiUrl;

export interface Sede {
  sede_id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  status: string;
  sales: number;
}

export interface User {
  user_id: string;
  username: string;
  display_name?: string;
  dni?: string;
  phone?: string;
  shift?: string;
  role: 'admin' | 'cajero' | 'mesero';
  sede_id: string;
  is_active: boolean;
}

export interface Product {
  product_id: string;
  name: string;
  description?: string;
  price: number;
  icon?: string;
  category_id: string;
  is_combo: boolean;
  is_active: boolean;
  combo_items?: { product_id: string; qty: number }[];
}

export interface InventoryItem {
  inventory_id: string;
  product_id: string;
  sede_id: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  status: string;
}

export interface Order {
  order_id: string;
  sede_id: string;
  user_id: string;
  order_date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

export interface OrderItem {
  order_item_id: string;
  product_id: string;
  product_name: string;
  qty: number;
  unit_price: number;
  subtotal: number;
}

export interface KdsTicket {
  ticket_id: string;
  order_id: string;
  type: string;
  status: string;
  label: string;
  created_at: string;
}

export interface Merma {
  merma_id: string;
  inventory_id: string;
  quantity: number;
  unit: string;
  reason: string;
  notes?: string;
  registered_by: string;
  created_at: string;
}

export interface Notification {
  notification_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  user_id?: string;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  force?: boolean;
  device_info?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface DashboardData {
  kpi: {
    total_sales_today: number;
    total_orders_today: number;
    critical_stock_count: number;
    active_sedes: number;
  };
  top_products: { name: string; qty: number; total: number; pct: number }[];
  recent_transactions: { id: string; sede_name: string; product: string; amount: number; time: string }[];
  category_distribution: { name: string; pct: number; value: string; color: string }[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  login(data: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${API}/auth/login`, data);
  }

  refreshToken(refresh_token: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${API}/auth/refresh`, { refresh_token });
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${API}/auth/me`);
  }

  getSedes(): Observable<Sede[]> {
    return this.http.get<Sede[]>(`${API}/sedes`);
  }

  createSede(data: Partial<Sede>): Observable<Sede> {
    return this.http.post<Sede>(`${API}/sedes`, data);
  }

  updateSede(id: string, data: Partial<Sede>): Observable<Sede> {
    return this.http.put<Sede>(`${API}/sedes/${id}`, data);
  }

  deleteSede(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/sedes/${id}`);
  }

  getUsers(sedeId?: string): Observable<User[]> {
    let params: any = {};
    if (sedeId) params.sede_id = sedeId;
    return this.http.get<User[]>(`${API}/users`, { params });
  }

  createUser(data: Partial<User> & { password: string }): Observable<User> {
    return this.http.post<User>(`${API}/users`, data);
  }

  updateUser(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${API}/users/${id}`, data);
  }

  deactivateUser(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/users/${id}`);
  }

  getProducts(category?: string, search?: string): Observable<Product[]> {
    let params: any = {};
    if (category) params.category_id = category;
    if (search) params.search = search;
    return this.http.get<Product[]>(`${API}/products`, { params });
  }

  createProduct(data: any): Observable<Product> {
    return this.http.post<Product>(`${API}/products`, data);
  }

  updateProduct(id: string, data: any): Observable<Product> {
    return this.http.put<Product>(`${API}/products/${id}`, data);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/products/${id}`);
  }

  getInventory(sedeId?: string): Observable<InventoryItem[]> {
    let params: any = {};
    if (sedeId) params.sede_id = sedeId;
    return this.http.get<InventoryItem[]>(`${API}/inventory`, { params });
  }

  updateInventory(id: string, data: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.patch<InventoryItem>(`${API}/inventory/${id}`, data);
  }

  getOrders(sedeId?: string, status?: string): Observable<Order[]> {
    let params: any = {};
    if (sedeId) params.sede_id = sedeId;
    if (status) params.status_filter = status;
    return this.http.get<Order[]>(`${API}/orders`, { params });
  }

  createOrder(data: any): Observable<Order> {
    return this.http.post<Order>(`${API}/orders`, data);
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.http.patch<Order>(`${API}/orders/${id}/status`, { status });
  }

  getKdsTickets(sedeId?: string): Observable<KdsTicket[]> {
    let params: any = {};
    if (sedeId) params.sede_id = sedeId;
    return this.http.get<KdsTicket[]>(`${API}/kds`, { params });
  }

  updateKdsTicketStatus(id: string, status: string): Observable<KdsTicket> {
    return this.http.patch<KdsTicket>(`${API}/kds/${id}/status`, { status });
  }

  getMermas(sedeId?: string): Observable<Merma[]> {
    let params: any = {};
    if (sedeId) params.sede_id = sedeId;
    return this.http.get<Merma[]>(`${API}/mermas`, { params });
  }

  createMerma(data: any): Observable<Merma> {
    return this.http.post<Merma>(`${API}/mermas`, data);
  }

  getNotifications(unreadOnly?: boolean): Observable<Notification[]> {
    let params: any = {};
    if (unreadOnly) params.unread_only = true;
    return this.http.get<Notification[]>(`${API}/notifications`, { params });
  }

  markNotificationRead(id: string): Observable<void> {
    return this.http.patch<void>(`${API}/notifications/${id}/read`, {});
  }

  markAllNotificationsRead(): Observable<void> {
    return this.http.post<void>(`${API}/notifications/read-all`, {});
  }

  getDashboard(sedeId?: string): Observable<DashboardData> {
    let params: any = {};
    if (sedeId) params.sede_id = sedeId;
    return this.http.get<DashboardData>(`${API}/dashboard`, { params });
  }
}
