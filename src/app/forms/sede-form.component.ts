import { ChangeDetectionStrategy, Component, output, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sede-form',
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full bg-[#0f1115] text-white animate-[fadeIn_0.3s_ease-out] relative">
      <!-- Decorative Background elements -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-60 -mt-60 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none"></div>

      <header class="flex justify-between items-center px-10 pt-10 pb-6 shrink-0 relative z-10 border-b border-white/5 bg-[#0f1115]/50 backdrop-blur-md">
        <div>
          <h2 class="text-[36px] font-black tracking-tight mb-1 text-white leading-none">
            {{ sedeToEdit() ? 'Editar Sucursal' : 'Registro de Sucursal' }}
          </h2>
          <p class="text-[15px] font-bold text-on-surface-variant/80 tracking-wide">
            {{ sedeToEdit() ? 'Modifique los parámetros del local comercial activo' : 'Configure los parámetros del nuevo local comercial' }}
          </p>
        </div>
        <button (click)="canceled.emit()" class="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/5 text-on-surface-variant transition-colors">
          <span class="material-symbols-outlined !text-[28px]">close</span>
        </button>
      </header>

      <div class="flex-1 overflow-y-auto subtle-scrollbar p-10 relative z-10">
        <div class="max-w-3xl mx-auto">
          <div class="bg-[#1c1e22]/50 border border-white/5 rounded-3xl p-10 shadow-2xl backdrop-blur-sm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              <!-- Left: Form Fields -->
              <div class="space-y-8">
                <div class="flex items-center gap-4 mb-2">
                  <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <span class="material-symbols-outlined !text-[22px]">info</span>
                  </div>
                  <h3 class="text-[18px] font-black text-white tracking-tight uppercase tracking-wider">Detalles Generales</h3>
                </div>

                <div class="space-y-6">
                  <div class="group">
                    <label for="sede_name" class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-2 group-focus-within:text-primary transition-colors">Nombre de Sede</label>
                    <input #sedeName id="sede_name" type="text" [value]="sedeToEdit()?.name || ''" placeholder="Ej. Sede San Borja" 
                           class="w-full bg-[#111315] border border-white/10 rounded-xl px-5 py-4 text-[15px] text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-bold placeholder:text-white/20">
                  </div>

                  <div class="group">
                    <label for="sede_address" class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-2 group-focus-within:text-primary transition-colors">Dirección Fiscal / Operativa</label>
                    <input #sedeAddress id="sede_address" type="text" [value]="sedeToEdit()?.address || ''" placeholder="Ej. Av. Javier Prado Este 1234" 
                           class="w-full bg-[#111315] border border-white/10 rounded-xl px-5 py-4 text-[15px] text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-bold placeholder:text-white/20">
                  </div>

                  <div class="grid grid-cols-2 gap-6">
                    <div class="group">
                      <label for="sede_phone" class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-2 group-focus-within:text-primary transition-colors">Teléfono Contacto</label>
                      <input #sedePhone id="sede_phone" type="text" [value]="sedeToEdit()?.phone || ''" placeholder="987 654 321" 
                             class="w-full bg-[#111315] border border-white/10 rounded-xl px-5 py-4 text-[15px] text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-bold placeholder:text-white/20">
                    </div>
                    <div class="group">
                      <label for="sede_manager" class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-2 group-focus-within:text-primary transition-colors">Gerente Asignado</label>
                      <input #sedeManager id="sede_manager" type="text" [value]="sedeToEdit()?.manager || ''" placeholder="Nombre completo" 
                             class="w-full bg-[#111315] border border-white/10 rounded-xl px-5 py-4 text-[15px] text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-bold placeholder:text-white/20">
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right: Settings & Status -->
              <div class="space-y-8">
                <div class="flex items-center gap-4 mb-2">
                  <div class="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 shadow-inner">
                    <span class="material-symbols-outlined !text-[22px]">settings</span>
                  </div>
                  <h3 class="text-[18px] font-black text-white tracking-tight uppercase tracking-wider">Configuración</h3>
                </div>

                <div class="space-y-6">
                  <div>
                    <p class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-3">Estado de Apertura</p>
                    <div class="grid grid-cols-1 gap-3">
                      <button 
                        (click)="selectedStatus.set('Activa')"
                        [class]="selectedStatus() === 'Activa' ? 'border-primary/40 bg-primary/10 text-primary shadow-[0_0_15px_rgba(255,179,0,0.1)]' : 'border-white/5 bg-[#111315] text-white/50 hover:bg-white/5'"
                        class="flex items-center gap-4 p-4 rounded-xl border transition-all text-left">
                        <span class="material-symbols-outlined !text-[24px]">task_alt</span>
                        <div>
                          <p class="font-black text-[14px]">Operación Inmediata</p>
                          <p class="text-[11px] font-bold opacity-70 leading-none">Activar sede al confirmar registro</p>
                        </div>
                      </button>
                      
                      <button 
                        (click)="selectedStatus.set('Inactiva')"
                        [class]="selectedStatus() === 'Inactiva' ? 'border-rose-500/40 bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-white/5 bg-[#111315] text-white/50 hover:bg-white/5'"
                        class="flex items-center gap-4 p-4 rounded-xl border transition-all text-left">
                        <span class="material-symbols-outlined !text-[24px]">pause_circle</span>
                        <div>
                          <p class="font-black text-[14px]">Modo Configuración</p>
                          <p class="text-[11px] font-bold opacity-70 leading-none">Permanecer inactiva temporalmente</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div class="bg-primary/5 border border-primary/10 rounded-2xl p-5 mt-4">
                    <div class="flex items-center gap-3 mb-2 text-primary">
                      <span class="material-symbols-outlined !text-[20px] font-bold">verified_user</span>
                      <p class="text-[13px] font-black tracking-tight">Sincronización Automática</p>
                    </div>
                    <p class="text-[12px] font-bold text-on-surface-variant leading-relaxed">
                      Al registrar esta sede, el inventario base y la carta de productos POS serán vinculados automáticamente desde la matriz central.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row gap-5">
              <button (click)="canceled.emit()" class="flex-1 py-4.5 rounded-xl border border-white/10 text-on-surface font-black hover:bg-white/5 transition-all active:scale-[0.98] text-[15px] cursor-pointer"> 
                Descartar Cambios
              </button>
              <button 
                type="button"
                (click)="openConfirmModal(sedeName.value, sedeAddress.value, sedePhone.value, sedeManager.value)"
                class="flex-[2] py-4.5 bg-primary hover:bg-[#ffbd0a] text-[#131517] font-black rounded-xl shadow-[0_10px_30px_rgba(255,179,0,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-[16px] cursor-pointer">
                <span class="material-symbols-outlined !text-[22px] font-bold">
                  {{ sedeToEdit() ? 'save' : 'add_business' }}
                </span>
                {{ sedeToEdit() ? 'GUARDAR CAMBIOS' : 'CONCLUIR REGISTRO DE SEDE' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirmation Modal -->
      @if (showConfirmModal()) {
        <div id="sede-confirm-modal" class="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] p-4 text-white">
          <div class="bg-[#1d2229] border border-white/10 rounded-xl shadow-2xl p-8 max-w-[420px] w-full transform transition-all animate-[slideUp_0.3s_ease-out]">
            
            <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-inner mx-auto border border-primary/20">
              <span class="material-symbols-outlined !text-[32px] font-bold">
                {{ sedeToEdit() ? 'live_help' : 'add_business' }}
              </span>
            </div>

            <h3 class="text-center text-[22px] font-black text-white leading-tight mb-2">
              {{ sedeToEdit() ? '¿Guardar Cambios?' : '¿Confirmar Sede?' }}
            </h3>
            
            <p class="text-center text-on-surface-variant font-medium text-[14px] mb-6 leading-snug tracking-wide">
              {{ sedeToEdit() ? '¿Está seguro de que desea guardar los cambios de esta sucursal?' : '¿Desea registrar esta nueva sucursal en el sistema?' }}
            </p>

            <!-- Details Summary Box -->
            <div class="bg-[#15181c] border border-white/5 rounded-lg p-5 mb-8 space-y-4 shadow-inner text-left">
              <div class="flex justify-between items-start pb-2.5 border-b border-white/5">
                <span class="text-[13px] text-on-surface-variant font-bold uppercase tracking-wider">Sucursal</span>
                <span class="text-[14px] font-black text-white text-right max-w-[200px] truncate" [title]="pendingData()?.name">
                  {{ pendingData()?.name || 'Sede nueva' }}
                </span>
              </div>
              
              <div class="flex justify-between items-start pb-2.5 border-b border-white/5">
                <span class="text-[13px] text-on-surface-variant font-bold uppercase tracking-wider">Dirección</span>
                <span class="text-[14px] font-bold text-white/80 text-right max-w-[200px] truncate" [title]="pendingData()?.address">
                  {{ pendingData()?.address || '-' }}
                </span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-[13px] text-on-surface-variant font-bold uppercase tracking-wider">Estado</span>
                <span class="text-[13px] font-black px-2.5 py-1 rounded" 
                      [class]="pendingData()?.status === 'Activa' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'">
                  {{ pendingData()?.status }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-4">
              <button (click)="showConfirmModal.set(false)" 
                      class="flex-1 bg-transparent hover:bg-white/[0.05] text-[#f1f3f5] font-bold py-3.5 rounded-lg border border-white/10 transition-colors active:scale-95 cursor-pointer">
                Cancelar
              </button>
              <button (click)="confirmSave()" 
                      class="flex-1 bg-primary hover:bg-[#ffbd0a] text-[#131517] font-black py-3.5 rounded-lg transition-colors shadow-md active:scale-95 cursor-pointer">
                Confirmar
              </button>
            </div>

          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class SedeFormComponent {
  sedeToEdit = input<{
    id?: string;
    name: string;
    address: string;
    phone: string;
    manager: string;
    status: 'Activa' | 'Inactiva';
    sales?: string;
  } | null>(null);
  
  saved = output<{name: string, address: string, phone: string, manager: string, status: 'Activa' | 'Inactiva'}>();
  canceled = output<void>();

  selectedStatus = signal<'Activa' | 'Inactiva'>('Activa');
  showConfirmModal = signal<boolean>(false);
  pendingData = signal<{name: string, address: string, phone: string, manager: string, status: 'Activa' | 'Inactiva'} | null>(null);

  constructor() {
    effect(() => {
      const edit = this.sedeToEdit();
      if (edit) {
        this.selectedStatus.set(edit.status || 'Activa');
      } else {
        this.selectedStatus.set('Activa');
      }
    });
  }

  openConfirmModal(name: string, address: string, phone: string, manager: string) {
    this.pendingData.set({
      name,
      address,
      phone,
      manager,
      status: this.selectedStatus()
    });
    this.showConfirmModal.set(true);
  }

  confirmSave() {
    const data = this.pendingData();
    if (data) {
      this.saved.emit(data);
    }
    this.showConfirmModal.set(false);
    this.pendingData.set(null);
  }
}
