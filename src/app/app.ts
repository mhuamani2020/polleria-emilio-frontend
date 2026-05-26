import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { LoginFormComponent } from './forms/login-form.component';
import { ApiService } from './services/api.service';
import { AuthService, UserSession } from './services/auth.service';
import { StaffFormComponent } from './forms/staff-form.component';
import { InventoryFormComponent } from './forms/inventory-form.component';
import { MermaFormComponent } from './forms/merma-form.component';
import { ComboFormComponent } from './forms/combo-form.component';
import { SedeFormComponent } from './forms/sede-form.component';
import { ConfirmService } from './services/confirm.service';
import { WebSocketService } from './services/websocket.service';
import { ConfirmModalComponent } from './components/confirm-modal.component';

type ViewType = 'dashboard' | 'pos' | 'kds' | 'inventory' | 'customer-display' | 'inventory-edit' | 'staff-register' | 'staff-list' | 'login' | 'merma-register' | 'combo-register' | 'sedes' | 'sede-register' | 'stats' | 'loading';


interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

interface SedeItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  status: 'Activa' | 'Inactiva';
  sales: string;
}

interface PosProduct {
  productId: string;
  name: string;
  price: number;
  img: string;
  icon: string;
  category: string;
  description?: string;
  isCombo?: boolean;
  comboItems?: string[];
}

interface KdsTicket {
  id: string;
  type: 'Normal' | 'Urgent';
  time: string;
  label: string;
  items: string[];
}

interface InventoryItem {
  product: string;
  productName: string;
  inventoryId: string;
  icon: string;
  category: string;
  conversion: string;
  stock: string;
  min: string;
  status: 'Óptimo' | 'Precaución' | 'Crítico';
  statusColor?: string;
}

interface StaffItem {
  id: string;
  name: string;
  role: string;
  dni: string;
  phone: string;
  shift: string;
  status: 'Activo' | 'Inactivo';
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read: boolean;
}

interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  visible: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    CommonModule,
    LoginFormComponent,
    StaffFormComponent,
    InventoryFormComponent,
    MermaFormComponent,
    ComboFormComponent,
    SedeFormComponent,
    ConfirmModalComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private confirmService = inject(ConfirmService);
  private ws = inject(WebSocketService);

  constructor() {
    this.ws.messages.subscribe(msg => this.handleWsMessage(msg));
    this.restoreSession();
  }

  private async restoreSession() {
    const session = this.auth.currentSession();
    if (!session || !this.auth.accessToken) {
      this.currentView.set('login');
      return;
    }

    try {
      const user = await firstValueFrom(this.api.getMe());
      this.currentUserRole.set(session.role);
      this.currentUsername.set(session.username);
      this.currentUserDisplayName.set(user.display_name || session.username);

      const sedesData = await firstValueFrom(this.api.getSedes());
      this.sedes.set(sedesData.map(s => ({
        id: s.sede_id,
        name: s.name,
        address: s.address,
        phone: s.phone,
        manager: s.manager,
        status: s.status as 'Activa' | 'Inactiva',
        sales: `S/. ${s.sales.toFixed(2)}`,
      })));
      this.selectSedeById(user.sede_id);

      this.ws.connect(this.auth.accessToken);

      if (session.role === 'admin') this.changeView('dashboard');
      else if (session.role === 'mesero') this.changeView('kds');
      else this.changeView('pos');
    } catch {
      this.currentView.set('login');
    }
  }

  currentView = signal<ViewType>('loading');
  isLoading = signal(false);

  // Notifications & Toasts system
  notifications = signal<NotificationItem[]>([]);

  toasts = signal<ToastItem[]>([]);
  showNotificationsDropdown = signal<boolean>(false);

  unreadNotificationsCount = computed(() => {
    return this.notifications().filter(n => !n.read).length;
  });
  showModal = signal<'none' | 'order' | 'stock' | 'staff' | 'staff-update' | 'staff-delete' | 'sede' | 'password'>('none');
  passwordError = signal<string>('');
  passwordLoading = signal<boolean>(false);
  currentUserRole = signal<'admin' | 'cajero' | 'mesero'>('admin');
  currentUsername = signal<string>('Invitado');
  currentUserDisplayName = signal<string>('');
  showUserMenu = signal<boolean>(false);

  // Stats Data
  statsTimeRange = signal<'Hoy' | 'Semana' | 'Mes'>('Hoy');
  statsTimeRanges: ('Hoy' | 'Semana' | 'Mes')[] = ['Hoy', 'Semana', 'Mes'];
  statsSedeFilter = signal<string>('all'); // 'all' or '1' or '2' or '3'
  
  // Base values for stats
  statsBaseRevenue = signal<number>(0);
  statsBaseOrders = signal<number>(0);
  statsBasePrepTime = signal<number>(0);

  // Real-time log of recent transactions
  statsRecentTransactions = signal<{
    id: string;
    sedeName: string;
    product: string;
    amount: number;
    time: string;
  }[]>([]);

  // Dynamic computed stats
  statsComputedRevenue = computed(() => {
    let base = this.statsBaseRevenue();
    const range = this.statsTimeRange();
    const filter = this.statsSedeFilter();
    
    if (filter === '1') {
      base = this.statsBaseRevenue() * 0.62; // Sede Surco sales fraction
    } else if (filter === '2') {
      base = this.statsBaseRevenue() * 0.38; // Sede Miraflores sales fraction
    } else if (filter === '3') {
      base = 0; // Sede San Isidro is inactive
    }
    
    if (range === 'Semana') {
      return base * 6.8;
    } else if (range === 'Mes') {
      return base * 28.5;
    }
    return base;
  });

  statsComputedOrders = computed(() => {
    let base = this.statsBaseOrders();
    const range = this.statsTimeRange();
    const filter = this.statsSedeFilter();
    
    if (filter === '1') {
      base = Math.round(this.statsBaseOrders() * 0.65);
    } else if (filter === '2') {
      base = Math.round(this.statsBaseOrders() * 0.35);
    } else if (filter === '3') {
      base = 0;
    }
    
    if (range === 'Semana') {
      return Math.round(base * 6.5);
    } else if (range === 'Mes') {
      return Math.round(base * 27.2);
    }
    return base;
  });

  statsComputedPrepTime = computed(() => {
    const filter = this.statsSedeFilter();
    let base = this.statsBasePrepTime();
    if (filter === '1') {
      base = 13.2;
    } else if (filter === '2') {
      base = 16.4;
    } else if (filter === '3') {
      base = 0;
    }
    return base;
  });

  // Category breakdown
  statsCategoryDistribution = signal<{ name: string; pct: number; value: string; color: string }[]>([]);

  // Top Products
  statsTopProducts = computed(() => {
    const filter = this.statsSedeFilter();
    const range = this.statsTimeRange();
    let mult = 1;
    if (range === 'Semana') mult = 6.5;
    if (range === 'Mes') mult = 27;

    if (filter === '2') {
      return [
        { name: 'Pollo 1/4 + Papas', qty: Math.round(45 * mult), total: `S/. ${(1102 * mult).toFixed(0)}`, pct: 85 },
        { name: 'Mostrito Especial', qty: Math.round(28 * mult), total: `S/. ${(784 * mult).toFixed(0)}`, pct: 60 },
        { name: 'Promo Duo Platos', qty: Math.round(20 * mult), total: `S/. ${(918 * mult).toFixed(0)}`, pct: 45 }
      ];
    }
    if (filter === '3') {
      return [];
    }
    return [
      { name: 'Pollo a la Brasa Entero', qty: Math.round(112 * mult), total: `S/. ${(8960 * mult).toFixed(0)}`, pct: 95 },
      { name: 'Mostrito Especial', qty: Math.round(84 * mult), total: `S/. ${(2352 * mult).toFixed(0)}`, pct: 75 },
      { name: 'Promo Duo Platos', qty: Math.round(65 * mult), total: `S/. ${(2983 * mult).toFixed(0)}`, pct: 60 },
      { name: 'Combo Familiar Brasa', qty: Math.round(56 * mult), total: `S/. ${(5034 * mult).toFixed(0)}`, pct: 50 },
      { name: 'Chicha Morada 1L', qty: Math.round(95 * mult), total: `S/. ${(1425 * mult).toFixed(0)}`, pct: 40 }
    ];
  });

  simulateTransaction() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      
      const randomProducts = [
        { name: 'Promo Duo Platos', price: 45.90 },
        { name: 'Pollo 1/4 + Papas', price: 24.50 },
        { name: 'Combo Familiar Brasa', price: 89.90 },
        { name: 'Mostrito Especial', price: 28.00 },
        { name: 'Chicha Morada 1L', price: 15.00 }
      ];
      
      const randomProduct = randomProducts[Math.floor(Math.random() * randomProducts.length)];
      const activeSedes = this.sedes().filter(s => s.status === 'Activa');
      if (activeSedes.length === 0) return;
      const randomSede = activeSedes[Math.floor(Math.random() * activeSedes.length)];
      
      const txId = 'T' + Math.floor(10000 + Math.random() * 90000);
      
      // Update stats
      this.statsBaseRevenue.update(v => v + randomProduct.price);
      this.statsBaseOrders.update(o => o + 1);
      
      // Update preparation speed slightly dynamically
      this.statsBasePrepTime.update(t => {
        const delta = (Math.random() - 0.5) * 0.4;
        const newVal = t + delta;
        return parseFloat(newVal < 5 ? '5.0' : newVal > 25 ? '25.0' : newVal.toFixed(1));
      });
      
      // Prepend recent transaction
      this.statsRecentTransactions.update(txs => [
        {
          id: txId,
          sedeName: randomSede.name,
          product: randomProduct.name,
          amount: randomProduct.price,
          time: 'Justo ahora'
        },
        ...txs.map(t => {
          if (t.time === 'Justo ahora') return { ...t, time: 'Hace 1 min' };
          if (t.time.startsWith('Hace')) {
            const min = parseInt(t.time.replace(/[^0-9]/g, ''));
            return { ...t, time: `Hace ${min + 1} min` };
          }
          return t;
        })
      ].slice(0, 7)); // limit to 7
    }, 400);
  }

  sedes = signal<SedeItem[]>([]);

  currentSede = signal<SedeItem | null>(null);
  sedeToEdit = signal<SedeItem | null>(null);

  // For Sede creation
  newSedeName = '';
  newSedeAddress = '';
  newSedePhone = '';
  newSedeManager = '';
  newSedeStatus: 'Activa' | 'Inactiva' = 'Activa';

  staffMembers = signal<StaffItem[]>([]);

  staffToEdit = signal<StaffItem | null>(null);
  pendingStaff = signal<{ name: string; dni: string; phone: string; role: string; shift: string; status: 'Activo' | 'Inactivo' } | null>(null);
  staffToDeleteId = signal<string | null>(null);

  // Customer Display Data
  preparingOrders: string[] = [];
  readyOrders: string[] = [];
  latestReadyOrder = '';

  // Inventory Data (from image)
  inventorySearchText = signal<string>('');
  activeInventoryCategory = signal<string>('Todos');
  inventorySortOption = signal<'alphabetical-asc' | 'alphabetical-desc' | 'stock-asc' | 'stock-desc' | 'status-critical'>('alphabetical-asc');
  showInventorySortMenu = signal<boolean>(false);

  inventoryList = signal<InventoryItem[]>([]);

  parseStockValue(stockStr: string): number {
    if (stockStr === '∞') return Infinity;
    const match = stockStr.match(/^[0-9.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  setInventorySort(option: 'alphabetical-asc' | 'alphabetical-desc' | 'stock-asc' | 'stock-desc' | 'status-critical') {
    this.inventorySortOption.set(option);
    this.showInventorySortMenu.set(false);
  }

  filteredInventoryList = computed(() => {
    const search = this.inventorySearchText().toLowerCase().trim();
    const cat = this.activeInventoryCategory();
    const sort = this.inventorySortOption();

    // 1. Filter
    const filtered = this.inventoryList().filter(item => {
      const matchesSearch = item.product.toLowerCase().includes(search) || item.category.toLowerCase().includes(search);
      const matchesCategory = cat === 'Todos' || item.category === cat;
      return matchesSearch && matchesCategory;
    });

    // 2. Sort
    return [...filtered].sort((a, b) => {
      if (sort === 'alphabetical-asc') {
        return a.product.localeCompare(b.product);
      } else if (sort === 'alphabetical-desc') {
        return b.product.localeCompare(a.product);
      } else if (sort === 'stock-asc') {
        return this.parseStockValue(a.stock) - this.parseStockValue(b.stock);
      } else if (sort === 'stock-desc') {
        return this.parseStockValue(b.stock) - this.parseStockValue(a.stock);
      } else if (sort === 'status-critical') {
        const priorityScore = (status: string) => {
          if (status === 'Crítico') return 1;
          if (status === 'Precaución') return 2;
          return 3;
        };
        return priorityScore(a.status) - priorityScore(b.status);
      }
      return 0;
    });
  });

  // Dashboard Data
  inventory: { product: string; icon: string; ratio: string; stock: number; status: string }[] = [];

  // KDS Data
  kdsNew = signal<KdsTicket[]>([]);
  kdsPrep = signal<KdsTicket[]>([]);
  kdsReady = signal<KdsTicket[]>([]);
  kdsConfirmTicket = signal<KdsTicket | null>(null);
  kdsConfirmAction = signal<'start' | 'finish' | 'deliver' | null>(null);

  // POS Data
  posCategories = ['Todos', 'Pollos', 'Gaseosas', 'Mostritos', 'Combos'];
  activeCategory = signal('Todos');
  posSearchQuery = signal('');

  posProducts = signal<PosProduct[]>([]);

  filteredPosProducts = computed(() => {
    const cat = this.activeCategory();
    const query = this.posSearchQuery().toLowerCase().trim();
    return this.posProducts().filter(p => {
      const matchCat = cat === 'Todos' || p.category === cat;
      const matchQuery = !query || 
                         p.name.toLowerCase().includes(query) || 
                         (p.description && p.description.toLowerCase().includes(query)) ||
                         p.category.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });
  });

  currentOrder = signal<OrderItem[]>([]);
  
  orderSubtotal = computed(() => this.currentOrder().reduce((acc, item) => acc + item.price * item.qty, 0));
  orderTotal = computed(() => this.orderSubtotal() * 1.18);
  
  activePosTab = signal<'products' | 'cart'>('products');
  totalOrderItemsCount = computed(() => this.currentOrder().reduce((acc, item) => acc + item.qty, 0));
  
  mobileSidebarOpen = signal(false);

  changeView(view: ViewType) {
    if (view === 'loading') {
      this.currentView.set(view);
      return;
    }
    const role = this.currentUserRole();
    const allowed: Record<string, ViewType[]> = {
      admin: [
        'dashboard', 'pos', 'kds', 'inventory', 'inventory-edit',
        'merma-register', 'combo-register', 'staff-list', 'staff-register',
        'sedes', 'sede-register', 'stats', 'login',
      ],
      cajero: ['pos', 'kds', 'inventory', 'inventory-edit', 'merma-register', 'login'],
      mesero: ['kds', 'login'],
    };
    if (!(allowed[role] || ['login']).includes(view)) {
      this.addNotification('Acceso Denegado 🚫', 'No tienes permiso para acceder a esta sección.', 'warning');
      return;
    }
    this.currentView.set(view);
    this.mobileSidebarOpen.set(false);
    if (view === 'dashboard') { this.loadDashboard(); this.loadNotifications(); }
    if (view === 'sedes') this.loadSedes();
    if (view === 'pos') {
      if (this.sedes().length === 0) this.loadSedes();
      this.loadProducts();
    }
    if (view === 'inventory') { this.loadSedes(); this.loadInventory(); }
    if (view === 'kds') {
      this.loadKdsTickets();
      if (this.currentUserRole() !== 'mesero') this.loadNotifications();
    }
    if (view === 'staff-list') this.loadStaff();
    if (view === 'stats') this.loadDashboard();
  }

  toggleMobileSidebar() {
    this.mobileSidebarOpen.update(v => !v);
  }

  // --- Notifications Helper Methods ---
  toggleNotifications(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.showNotificationsDropdown.update(v => !v);
  }

  closeNotificationsDropdown() {
    this.showNotificationsDropdown.set(false);
  }

  markAllAsRead() {
    this.notifications.update(list => list.map(n => ({ ...n, read: true })));
    this.api.markAllNotificationsRead().subscribe();
    this.playSparkSound();
  }

  markAsRead(id: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.notifications.update(list => list.map(n => n.id === id ? { ...n, read: true } : n));
    this.api.markNotificationRead(id).subscribe();
  }

  clearNotifications() {
    this.notifications.set([]);
    this.showNotificationsDropdown.set(false);
  }

  addNotification(title: string, message: string, type: 'info' | 'warning' | 'success' | 'alert') {
    const id = 'notif_' + Date.now();
    const newNotif: NotificationItem = {
      id,
      title,
      message,
      time: 'Justo ahora',
      type,
      read: false
    };

    // Update list (add to top)
    this.notifications.update(list => [newNotif, ...list]);

    // Create a Toast
    const newToast: ToastItem = {
      id,
      title,
      message,
      type,
      visible: true
    };
    this.toasts.update(tList => [...tList, newToast]);

    // Play sound synthesis
    this.playNotificationSound();

    // Fade and dismiss toast
    setTimeout(() => {
      this.dismissToast(id);
    }, 4500);
  }

  dismissToast(id: string) {
    this.toasts.update(tList => tList.map(t => t.id === id ? { ...t, visible: false } : t));
    // Completely remove after animation completes
    setTimeout(() => {
      this.toasts.update(tList => tList.filter(t => t.id !== id));
    }, 500);
  }

  playNotificationSound() {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.type = 'triangle';
      osc2.type = 'sine';
      
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc1.frequency.setValueAtTime(880.00, ctx.currentTime + 0.2); // A5

      osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.1); // C6
      
      gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      
      osc1.start();
      osc2.start();
      
      osc1.stop(ctx.currentTime + 0.5);
      osc2.stop(ctx.currentTime + 0.5);
    } catch {
      // Ignored if blocked by browser autoplay policy
    }
  }

  playSparkSound() {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880.00, ctx.currentTime);
      osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Ignored
    }
  }

  // --- Modal & Loading actions ---
  openModal(type: 'order' | 'stock' | 'staff' | 'staff-update' | 'staff-delete' | 'sede') {
    this.showModal.set(type);
  }

  closeModal() {
    this.showModal.set('none');
    this.pendingStaff.set(null);
    this.staffToDeleteId.set(null);
    this.passwordError.set('');
    this.passwordLoading.set(false);
  }

  confirmSaveStaff(data: { name: string; dni: string; phone: string; role: string; shift: string; status: 'Activo' | 'Inactivo' }) {
    this.pendingStaff.set(data);
    if (this.staffToEdit()) {
      this.openModal('staff-update');
    } else {
      this.openModal('staff');
    }
  }

  executeAction() {
    const type = this.showModal();
    if (type === 'none') return;
    
    this.isLoading.set(true);
    this.showModal.set('none');
    
    setTimeout(() => {
      this.isLoading.set(false);
      if (type === 'order') {
        this.chargeOrder();
      } else if (type === 'stock') {
        this.addNotification('Registro Guardado ✔️', 'Se actualizaron con éxito los registros del inventario o combos.', 'success');
        this.changeView('inventory');
      } else if (type === 'staff' || type === 'staff-update') {
        if (this.pendingStaff()) {
          this.saveStaff(this.pendingStaff()!);
          this.pendingStaff.set(null);
        } else {
          this.changeView('staff-list');
        }
      } else if (type === 'staff-delete') {
        const idToDelete = this.staffToDeleteId();
        if (idToDelete) {
          this.deleteStaff(idToDelete);
          this.staffToDeleteId.set(null);
        }
      } else if (type === 'sede') {
        this.changeView('sedes');
      }
    }, 1500);
  }

  onMermaSaved() {
    this.changeView('inventory');
  }

  saveMerma(data: { inventory_id: string; quantity: number; unit: string; reason: string; notes: string }) {
    this.isLoading.set(true);
    this.api.createMerma(data).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.addNotification('Merma Registrada 🥦', 'Se registró la merma del insumo y se descontó de inmediato de su stock.', 'alert');
        this.changeView('inventory');
      },
      error: () => {
        this.isLoading.set(false);
        this.addNotification('Error ❌', 'No se pudo registrar la merma', 'alert');
      }
    });
  }

  async handleLogin(creds: { username: string; password: string; role: 'admin' | 'cajero' | 'mesero'; sedeId: string; displayName: string }, force = false) {
    this.isLoading.set(true);
    const body: Record<string, unknown> = { username: creds.username, password: creds.password };
    if (force) body['force'] = true;
    try {
      const tokens = await firstValueFrom(this.api.login(body as any));
      this.auth.setTokens(tokens.access_token, tokens.refresh_token);
      this.ws.connect(tokens.access_token);
      try {
        const user = await firstValueFrom(this.api.getMe());
        this.auth.setSession({
          role: user.role,
          sedeId: user.sede_id,
          username: user.username,
          userId: user.user_id,
        });
        this.currentUserRole.set(user.role);
        this.currentUsername.set(user.username);
        this.currentUserDisplayName.set(user.display_name || user.username);

        const sedesData = await firstValueFrom(this.api.getSedes());
        this.sedes.set(sedesData.map(s => ({
          id: s.sede_id,
          name: s.name,
          address: s.address,
          phone: s.phone,
          manager: s.manager,
          status: s.status as 'Activa' | 'Inactiva',
          sales: `S/. ${s.sales.toFixed(2)}`,
        })));
        this.selectSedeById(user.sede_id);

        this.isLoading.set(false);
        this.addNotification('Inicio de Sesión Exitoso ✔️', `Bienvenido ${user.username}`, 'success');
        if (user.role === 'admin') {
          this.changeView('dashboard');
        } else if (user.role === 'mesero') {
          this.changeView('kds');
        } else {
          this.changeView('pos');
        }
      } catch {
        this.isLoading.set(false);
        this.auth.setSession({
          role: creds.role,
          sedeId: creds.sedeId,
          username: creds.displayName,
          userId: '',
        });
        this.currentUserRole.set(creds.role);
        this.currentUsername.set(creds.displayName);
        this.selectSedeById(creds.sedeId);
        if (creds.role === 'admin') {
          this.changeView('dashboard');
        } else if (creds.role === 'mesero') {
          this.changeView('kds');
        } else {
          this.changeView('pos');
        }
      }
    } catch (err: any) {
      this.isLoading.set(false);
      const detail = err.error?.detail || err.message || 'Error de conexión';
      if (err.status === 409) {
        const ok = await this.confirmService.confirm({
          title: 'Sesión Activa',
          message: 'Ya tienes una sesión activa en otro dispositivo. ¿Deseas cerrarla e iniciar sesión aquí?',
          confirmText: 'Forzar Sesión',
          cancelText: 'Cancelar',
          type: 'warning',
        });
        if (ok) {
          this.handleLogin(creds, true);
        }
      } else {
        this.addNotification('Error de Login ❌', detail, 'alert');
      }
    }
  }

  onSedeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectSedeById(target.value);
  }

  changePasswordSubmit(event: Event) {
    event.preventDefault();
    this.passwordError.set('');
    const form = event.target as HTMLFormElement;
    const current = (form.elements.namedItem('current_password') as HTMLInputElement).value;
    const newPass = (form.elements.namedItem('new_password') as HTMLInputElement).value;
    const confirm = (form.elements.namedItem('confirm_password') as HTMLInputElement).value;

    if (!current || !newPass || !confirm) {
      this.passwordError.set('Todos los campos son obligatorios');
      return;
    }
    if (newPass.length < 8) {
      this.passwordError.set('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (newPass !== confirm) {
      this.passwordError.set('Las contraseñas nuevas no coinciden');
      return;
    }

    this.passwordLoading.set(true);
    this.handlePasswordChange({ current_password: current, new_password: newPass }).then(ok => {
      this.passwordLoading.set(false);
      if (ok) this.closeModal();
    });
  }

  toggleUserMenu(event?: Event) {
    if (event) event.stopPropagation();
    this.showUserMenu.update(v => !v);
  }

  closeUserMenu() {
    this.showUserMenu.set(false);
  }

  async handlePasswordChange(data: { current_password: string; new_password: string }): Promise<boolean> {
    try {
      await firstValueFrom(this.api.changePassword(data));
      this.addNotification('Contraseña Actualizada ✔️', 'Tu contraseña fue cambiada exitosamente.', 'success');
      return true;
    } catch (err: any) {
      const detail = err.error?.detail || 'Error al cambiar contraseña';
      this.addNotification('Error ❌', detail, 'alert');
      return false;
    }
  }

  handleLogout() {
    this.closeUserMenu();
    this.ws.disconnect();
    this.api.logout().subscribe({ error: () => {} });
    this.auth.clear();
    this.currentView.set('login');
  }

  private handleWsMessage(msg: { type: string; data: any }) {
    switch (msg.type) {
      case 'order_created':
        this.addNotification('Nueva Orden 📋', `Orden registrada`, 'success');
        if (this.currentView() === 'kds') this.loadKdsTickets();
        break;
      case 'order_status_changed':
        if (this.currentView() === 'kds') this.loadKdsTickets();
        if (this.currentView() === 'dashboard') this.loadDashboard();
        break;
      case 'kds_ticket_updated':
        if (this.currentView() === 'kds') this.loadKdsTickets();
        break;
      case 'notification_new':
        this.loadNotifications();
        break;
      case 'inventory_critical':
        this.addNotification('Stock Crítico ⚠️', `El stock de un insumo está en nivel crítico.`, 'alert');
        if (this.currentView() === 'inventory') this.loadInventory();
        break;
    }
  }

  selectSedeById(id: string) {
    const found = this.sedes().find(s => s.id === id);
    if (found) {
      this.currentSede.set(found);
    }
  }

  addSede(name: string, address: string, phone: string, manager: string, status: 'Activa' | 'Inactiva') {
    if (!name.trim() || !address.trim()) return;
    this.isLoading.set(true);
    this.api.createSede({
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim() || '-',
      manager: manager.trim() || '-',
      status
    }).subscribe({
      next: (sede) => {
        this.isLoading.set(false);
        const newItem: SedeItem = {
          id: sede.sede_id,
          name: sede.name,
          address: sede.address,
          phone: sede.phone,
          manager: sede.manager,
          status: sede.status as 'Activa' | 'Inactiva',
          sales: `S/. ${sede.sales.toFixed(2)}`
        };
        this.sedes.update(list => [...list, newItem]);
        this.currentSede.set(newItem);
        this.openModal('sede');
        this.addNotification('Nueva Sede Creada 🏢', `Se registró la sucursal "${sede.name}" en el sistema de sucursales.`, 'success');
      },
      error: () => {
        this.isLoading.set(false);
        this.addNotification('Error ❌', 'No se pudo crear la sede', 'alert');
      }
    });
  }

  editSede(sede: SedeItem) {
    this.sedeToEdit.set(sede);
    this.changeView('sede-register');
  }

  saveSede(data: { name: string; address: string; phone: string; manager: string; status: 'Activa' | 'Inactiva' }) {
    const editMode = this.sedeToEdit();
    if (editMode) {
      this.isLoading.set(true);
      this.api.updateSede(editMode.id, {
        name: data.name.trim(),
        address: data.address.trim(),
        phone: data.phone.trim() || '-',
        manager: data.manager.trim() || '-',
        status: data.status
      }).subscribe({
        next: (sede) => {
          this.isLoading.set(false);
          const updatedItem: SedeItem = {
            id: sede.sede_id,
            name: sede.name,
            address: sede.address,
            phone: sede.phone,
            manager: sede.manager,
            status: sede.status as 'Activa' | 'Inactiva',
            sales: `S/. ${sede.sales.toFixed(2)}`
          };
          this.sedes.update(list => list.map(s => s.id === editMode.id ? updatedItem : s));
          const cur = this.currentSede();
          if (cur?.id === editMode.id) {
            this.currentSede.set(updatedItem);
          }
          this.sedeToEdit.set(null);
          this.changeView('sedes');
          this.addNotification('Sede Actualizada 🏢', `Se actualizaron los datos de la sucursal "${sede.name}" con éxito.`, 'info');
        },
        error: () => {
          this.isLoading.set(false);
          this.addNotification('Error ❌', 'No se pudo actualizar la sede', 'alert');
        }
      });
    } else {
      this.addSede(data.name, data.address, data.phone, data.manager, data.status);
    }
  }

  editStaff(staff: StaffItem) {
    this.staffToEdit.set(staff);
    this.changeView('staff-register');
  }

  deleteStaff(id: string) {
    const staff = this.staffMembers().find(s => s.id === id);
    const name = staff ? staff.name : 'Miembro';
    this.isLoading.set(true);
    this.api.deactivateUser(id).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.staffMembers.update(list => list.filter(member => member.id !== id));
        this.addNotification('Personal Eliminado 👤', `Se removió a ${name} de la lista de personal.`, 'alert');
      },
      error: () => {
        this.isLoading.set(false);
        this.addNotification('Error ❌', `No se pudo desactivar a ${name}`, 'alert');
      }
    });
  }

  confirmDeleteStaff(id: string) {
    this.staffToDeleteId.set(id);
    this.openModal('staff-delete');
  }

  saveStaff(data: { name: string; dni: string; phone: string; role: string; shift: string; status: 'Activo' | 'Inactivo' }) {
    const editMode = this.staffToEdit();
    const roleMap: Record<string, 'admin' | 'cajero' | 'mesero'> = { 'Administrador': 'admin', 'Cajero': 'cajero', 'Mesero': 'mesero' };
    const backendRole = roleMap[data.role] || 'mesero';
    const isActive = data.status === 'Activo';

    if (editMode) {
      this.isLoading.set(true);
      this.api.updateUser(editMode.id, {
        display_name: data.name.trim() || 'Sin Nombre',
        dni: data.dni.trim() || undefined,
        phone: data.phone.trim() || undefined,
        shift: data.shift,
        role: backendRole,
        is_active: isActive,
      }).subscribe({
        next: (user) => {
          this.isLoading.set(false);
          this.staffMembers.update(list => list.map(s => s.id === editMode.id ? {
            ...s,
            name: user.display_name || user.username,
            dni: user.dni || '-',
            phone: user.phone || '-',
            role: data.role,
            shift: user.shift || '-',
            status: user.is_active ? 'Activo' : 'Inactivo'
          } : s));
          this.staffToEdit.set(null);
          this.changeView('staff-list');
          this.addNotification('Personal Actualizado 👤', `Se modificaron los datos de ${data.name.trim()} con éxito.`, 'info');
        },
        error: () => {
          this.isLoading.set(false);
          this.addNotification('Error ❌', 'No se pudo actualizar el personal', 'alert');
        }
      });
    } else {
      const curSede = this.currentSede();
      if (!curSede) {
        this.addNotification('Error ❌', 'Selecciona una sede activa primero', 'alert');
        return;
      }
      const username = data.name.trim().toLowerCase().replace(/[^a-z0-9_.]/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
      this.isLoading.set(true);
      this.api.createUser({
        username: username,
        password: 'Polleria123!',
        display_name: data.name.trim() || 'Sin Nombre',
        dni: data.dni.trim() || undefined,
        phone: data.phone.trim() || undefined,
        shift: data.shift,
        role: backendRole,
        sede_id: curSede.id,
      }).subscribe({
        next: (user) => {
          this.isLoading.set(false);
          const newMember: StaffItem = {
            id: user.user_id,
            name: user.display_name || user.username,
            dni: user.dni || '-',
            phone: user.phone || '-',
            role: data.role,
            shift: user.shift || '-',
            status: user.is_active ? 'Activo' : 'Inactivo'
          };
          this.staffMembers.update(list => [...list, newMember]);
          this.changeView('staff-list');
          this.addNotification('Personal Registrado 👤', `Se unió ${data.name.trim()} al personal en el turno ${data.shift}.`, 'success');
        },
        error: (err) => {
          this.isLoading.set(false);
          const detail = err.error?.detail || 'Error de conexión';
          this.addNotification('Error ❌', detail, 'alert');
        }
      });
    }
  }

  incrementQty(index: number) {
     this.currentOrder.update(orders => {
       const newOrders = [...orders];
       newOrders[index] = { ...newOrders[index], qty: newOrders[index].qty + 1 };
       return newOrders;
     });
  }

  decrementQty(index: number) {
     this.currentOrder.update(orders => {
       const newOrders = [...orders];
       if (newOrders[index].qty > 1) {
         newOrders[index] = { ...newOrders[index], qty: newOrders[index].qty - 1 };
       } else {
         newOrders.splice(index, 1);
       }
       return newOrders;
     });
  }
  
  addItem(product: PosProduct) {
    this.currentOrder.update(orders => {
      const existing = orders.findIndex(o => o.name === product.name);
      if (existing !== -1) {
        const newOrders = [...orders];
        newOrders[existing] = { ...newOrders[existing], qty: newOrders[existing].qty + 1 };
        return newOrders;
      }
      return [...orders, { productId: product.productId, name: product.name, price: product.price, qty: 1 }];
    });
  }

  clearOrder() {
    this.currentOrder.set([]);
  }

  chargeOrder() {
    const orders = this.currentOrder();
    const curSede = this.currentSede();
    if (orders.length === 0 || !curSede) return;

    this.isLoading.set(true);
    this.api.createOrder({
      sede_id: curSede.id,
      items: orders.map(o => ({
        product_id: o.productId,
        product_name: o.name,
        qty: o.qty,
        unit_price: o.price,
      }))
    }).subscribe({
      next: (order) => {
        this.isLoading.set(false);
        this.clearOrder();
        this.changeView('kds');
        this.addNotification('Nueva Orden Registrada 📋', `Orden registrada con ${orders.length} ítems.`, 'success');
        this.loadKdsTickets();
      },
      error: () => {
        this.isLoading.set(false);
        this.addNotification('Error ❌', 'No se pudo registrar la orden', 'alert');
      }
    });
  }

  startPreparation(ticket: KdsTicket) {
    this.api.updateKdsTicketStatus(ticket.id, 'en_preparacion').subscribe({
      next: () => {
        this.kdsNew.update(t => t.filter(x => x.id !== ticket.id));
        this.kdsPrep.update(t => [{ ...ticket, time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) }, ...t]);
        this.addNotification('Preparación Iniciada 👨‍🍳', `La orden #${ticket.id} comenzó a prepararse.`, 'info');
      },
      error: () => {
        this.addNotification('Error ❌', 'No se pudo actualizar el ticket KDS', 'alert');
      }
    });
  }

  finishPreparation(ticket: KdsTicket) {
    this.api.updateKdsTicketStatus(ticket.id, 'listo').subscribe({
      next: () => {
        this.kdsPrep.update(t => t.filter(x => x.id !== ticket.id));
        this.kdsReady.update(t => [{ ...ticket, time: 'Listo' }, ...t]);
        this.addNotification('¡Orden Lista! 🍗', `La orden #${ticket.id} está lista para entrega.`, 'success');
      },
      error: () => {
        this.addNotification('Error ❌', 'No se pudo marcar la orden como lista', 'alert');
      }
    });
  }

  deliverTicket(ticket: KdsTicket) {
    this.kdsReady.update(t => t.filter(x => x.id !== ticket.id));
    this.addNotification('Orden Entregada ✔️', `La orden #${ticket.id} para mesa/llevar ha sido entregada.`, 'info');
  }

  confirmKdsTransition(ticket: KdsTicket, action: 'start' | 'finish' | 'deliver') {
    this.kdsConfirmTicket.set(ticket);
    this.kdsConfirmAction.set(action);
  }

  cancelKdsTransition() {
    this.kdsConfirmTicket.set(null);
    this.kdsConfirmAction.set(null);
  }

  executeKdsTransition() {
    const ticket = this.kdsConfirmTicket();
    const action = this.kdsConfirmAction();
    if (ticket && action) {
      if (action === 'start') {
        this.startPreparation(ticket);
      } else if (action === 'finish') {
        this.finishPreparation(ticket);
      } else if (action === 'deliver') {
        this.deliverTicket(ticket);
      }
    }
    this.cancelKdsTransition();
  }

  loadDashboard() {
    this.api.getDashboard().subscribe({
      next: (data) => {
        this.statsBaseRevenue.set(data.kpi.total_sales_today);
        this.statsBaseOrders.set(data.kpi.total_orders_today);
        this.statsRecentTransactions.set(
          data.recent_transactions.map(t => ({
            id: t.id,
            sedeName: t.sede_name,
            product: t.product,
            amount: t.amount,
            time: t.time
          }))
        );
        this.statsCategoryDistribution.set(
          data.category_distribution.map(c => ({
            name: c.name,
            pct: c.pct,
            value: c.value,
            color: c.color
          }))
        );
      },
      error: () => {
        this.addNotification('Error ❌', 'No se pudo cargar el dashboard', 'alert');
      }
    });
  }

  loadSedes() {
    this.api.getSedes().subscribe({
      next: (data) => {
        this.sedes.set(data.map(s => ({
          id: s.sede_id,
          name: s.name,
          address: s.address,
          phone: s.phone,
          manager: s.manager,
          status: s.status as 'Activa' | 'Inactiva',
          sales: `S/. ${s.sales.toFixed(2)}`
        })));
      },
      error: () => {
        this.addNotification('Error ❌', 'No se pudieron cargar las sedes', 'alert');
      }
    });
  }

  loadStaff() {
    this.api.getUsers().subscribe({
      next: (data) => {
        this.staffMembers.set(data.map(u => ({
          id: u.user_id,
          name: u.display_name || u.username,
          role: u.role === 'admin' ? 'Administrador' : u.role === 'cajero' ? 'Cajero' : 'Mesero',
          dni: u.dni || '-',
          phone: u.phone || '-',
          shift: u.shift || '-',
          status: u.is_active ? 'Activo' : 'Inactivo'
        })));
      },
      error: () => {
        this.addNotification('Error ❌', 'No se pudo cargar el personal', 'alert');
      }
    });
  }

  loadProducts() {
    this.isLoading.set(true);
    this.api.getProducts().subscribe({
      next: (data) => {
        this.posProducts.set(data.map(p => ({
          productId: p.product_id,
          name: p.name,
          price: p.price,
          img: p.image_url || '',
          icon: p.icon || '',
          category: p.is_combo ? 'Combos' : 'Pollos',
          description: p.description,
          isCombo: p.is_combo,
          comboItems: p.combo_items?.map(c => `${c.qty}x ${c.product_id}`)
        })));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.addNotification('Error ❌', 'No se pudieron cargar los productos', 'alert');
      }
    });
  }

  loadInventory() {
    this.api.getProducts().subscribe({
      next: (products) => {
        const productMap = new Map(products.map(p => [p.product_id, p.name]));
        this.api.getInventory().subscribe({
          next: (data) => {
            this.inventoryList.set(data.map(i => ({
              product: i.product_id,
              productName: productMap.get(i.product_id) || i.product_id,
              inventoryId: i.inventory_id,
              icon: 'inventory_2',
              category: '',
              conversion: `${i.unit}`,
              stock: `${i.current_stock} ${i.unit}`,
              min: `${i.minimum_stock} ${i.unit}`,
              status: i.status as 'Óptimo' | 'Precaución' | 'Crítico',
            })));
          },
          error: () => {
            this.addNotification('Error ❌', 'No se pudo cargar el inventario', 'alert');
          }
        });
      },
      error: () => {
        this.addNotification('Error ❌', 'No se pudieron cargar los productos', 'alert');
      }
    });
  }

  loadKdsTickets() {
    this.api.getKdsTickets().subscribe({
      next: (data) => {
        const nuevos = data.filter(t => t.status === 'nuevo').map(t => ({
          id: t.ticket_id,
          type: (t.type === 'Urgente' ? 'Urgent' : 'Normal') as 'Normal' | 'Urgent',
          time: new Date(t.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
          label: t.label,
          items: [t.label]
        }));
        const prep = data.filter(t => t.status === 'en_preparacion').map(t => ({
          id: t.ticket_id,
          type: (t.type === 'Urgente' ? 'Urgent' : 'Normal') as 'Normal' | 'Urgent',
          time: new Date(t.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
          label: t.label,
          items: [t.label]
        }));
        const ready = data.filter(t => t.status === 'listo').map(t => ({
          id: t.ticket_id,
          type: (t.type === 'Urgente' ? 'Urgent' : 'Normal') as 'Normal' | 'Urgent',
          time: 'Listo',
          label: t.label,
          items: [t.label]
        }));
        this.kdsNew.set(nuevos);
        this.kdsPrep.set(prep);
        this.kdsReady.set(ready);
      },
      error: () => {
        this.addNotification('Error ❌', 'No se pudieron cargar los tickets KDS', 'alert');
      }
    });
  }

  loadNotifications() {
    this.api.getNotifications().subscribe({
      next: (data) => {
        this.notifications.set(data.map(n => ({
          id: n.notification_id,
          title: n.title,
          message: n.message,
          time: new Date(n.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
          type: n.type as 'info' | 'warning' | 'success' | 'alert',
          read: n.is_read
        })));
      },
      error: () => {
        this.addNotification('Error ❌', 'No se pudieron cargar las notificaciones', 'alert');
      }
    });
  }
}
