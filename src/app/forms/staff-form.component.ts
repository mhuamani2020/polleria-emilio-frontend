import { ChangeDetectionStrategy, Component, output, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-form',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="flex flex-col h-full bg-[#131517] text-on-surface animate-[fadeIn_0.2s_ease-out]">
    <header class="px-10 pt-10 pb-6 shrink-0">
      <div class="flex items-center gap-2 text-on-surface-variant font-bold text-[13px] mb-4">
        <span>Staff</span>
        <span class="material-symbols-outlined !text-[14px]">chevron_right</span>
        <span class="text-[#f1f3f5]">{{ staffToEdit() ? 'Editar Empleado' : 'Registrar Empleado' }}</span>
      </div>
      <h2 class="text-[36px] font-bold text-on-surface tracking-tight mb-1 font-sans leading-none">
        {{ staffToEdit() ? 'Editar Empleado' : 'Registrar Empleado' }}
      </h2>
      <p class="text-[15px] font-medium text-on-surface-variant mt-2 tracking-wide">
        {{ staffToEdit() ? 'Modifique los datos del miembro del equipo.' : 'Ingrese los datos del nuevo miembro del equipo.' }}
      </p>
    </header>

    <div class="flex-grow overflow-y-auto px-10 pb-10 subtle-scrollbar">
       <div class="flex flex-col lg:flex-row gap-6 max-w-[1000px]">
         
         <!-- Left Column -->
         <div class="flex-1 space-y-6">
           
           <div class="bg-[#1d2229] p-6 rounded-md border border-white/[0.04]">
             <h3 class="text-[18px] font-bold text-on-surface flex items-center gap-3 mb-6">
               <span class="material-symbols-outlined text-[#ffbd0a] !text-[22px]">person</span>
               Datos Personales
             </h3>
             
             <div class="space-y-6">
               <div>
                 <label for="staff-name" class="block text-[13px] font-bold text-on-surface-variant mb-2 tracking-wide">Nombre Completo</label>
                 <input #staffName [value]="staffToEdit()?.name || ''" id="staff-name" type="text" placeholder="Ej. Juan Pérez" class="w-full bg-[#242931] border border-white/5 rounded-md px-4 py-3 text-[14px] text-[#f1f3f5] placeholder:text-on-surface-variant/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner font-bold">
               </div>
               
               <div class="flex gap-6">
                 <div class="flex-1">
                   <label for="staff-dni" class="block text-[13px] font-bold text-[#f1f3f5] mb-2 tracking-wide">DNI / Documento</label>
                   <input #staffDni [value]="staffToEdit()?.dni || ''" id="staff-dni" type="text" placeholder="Número de documento" class="w-full bg-[#242931] border border-white/5 rounded-md px-4 py-3 text-[14px] text-[#f1f3f5] placeholder:text-on-surface-variant/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner font-bold">
                 </div>
                 
                 <div class="flex-1">
                   <label for="staff-phone" class="block text-[13px] font-bold text-[#f1f3f5] mb-2 tracking-wide">Teléfono</label>
                   <input #staffPhone [value]="staffToEdit()?.phone || ''" id="staff-phone" type="text" placeholder="Teléfono de contacto" class="w-full bg-[#242931] border border-white/5 rounded-md px-4 py-3 text-[14px] text-[#f1f3f5] placeholder:text-on-surface-variant/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner font-bold">
                 </div>
               </div>
             </div>
           </div>

           <div class="bg-[#1d2229] p-6 rounded-md border border-white/[0.04]">
             <h3 class="text-[18px] font-bold text-on-surface flex items-center gap-3 mb-6">
               <span class="material-symbols-outlined text-[#ffbd0a] !text-[22px]">schedule</span>
               Asignar Turnos
             </h3>
             
             <div class="flex p-1 bg-[#15181c] rounded-md border border-white/5 shadow-inner gap-1">
               <button 
                 (click)="selectedShift.set('Mañana')"
                 [class]="selectedShift() === 'Mañana' ? 'text-white bg-[#3c40c6] shadow-md border border-[#5c60f5]' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'"
                 class="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-md text-[13px] font-bold transition-transform active:scale-[0.98] cursor-pointer">
                 <span class="material-symbols-outlined !text-[20px]">light_mode</span>
                 Mañana
               </button>
               <button 
                 (click)="selectedShift.set('Tarde')"
                 [class]="selectedShift() === 'Tarde' ? 'text-white bg-[#3c40c6] shadow-md border border-[#5c60f5]' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'"
                 class="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-md text-[13px] font-bold transition-transform active:scale-[0.98] cursor-pointer">
                 <span class="material-symbols-outlined !text-[20px]">partly_cloudy_day</span>
                 Tarde
               </button>
               <button 
                 (click)="selectedShift.set('Noche')"
                 [class]="selectedShift() === 'Noche' ? 'text-white bg-[#3c40c6] shadow-md border border-[#5c60f5]' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'"
                 class="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-md text-[13px] font-bold transition-transform active:scale-[0.98] cursor-pointer">
                 <span class="material-symbols-outlined !text-[20px]">dark_mode</span>
                 Noche
               </button>
               <button 
                 (click)="selectedShift.set('Turno Completo')"
                 [class]="selectedShift() === 'Turno Completo' ? 'text-white bg-[#3c40c6] shadow-md border border-[#5c60f5]' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'"
                 class="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-md text-[13px] font-bold transition-transform active:scale-[0.98] cursor-pointer">
                 <span class="material-symbols-outlined !text-[20px]">work</span>
                 Completo
               </button>
             </div>
           </div>
           
         </div>

         <!-- Right Column -->
         <div class="w-full lg:w-[340px] shrink-0">
           
           <div class="bg-[#1d2229] p-6 rounded-md border border-white/[0.04] h-full flex flex-col justify-between">
             <div class="space-y-6">
               <h3 class="text-[18px] font-bold text-on-surface flex items-center gap-3 border-b border-white/5 pb-4">
                 <span class="material-symbols-outlined text-[#f1f3f5] !text-[22px]">admin_panel_settings</span>
                 Permisos y Acceso
               </h3>
               
               <div>
                 <span class="block text-[13px] font-bold text-[#f1f3f5] mb-2 tracking-wide">Rol en Sistema</span>
                 <div class="relative">
                   <button 
                     id="staff-role-btn"
                     type="button"
                     (click)="showRoleDropdown.set(!showRoleDropdown())"
                     class="w-full bg-[#242931] border border-white/5 rounded-md pl-4 pr-10 py-3.5 text-[14px] text-[#f1f3f5] flex items-center justify-between outline-none focus:ring-1 focus:ring-[#ffbd0a] focus:border-[#ffbd0a] transition-all cursor-pointer shadow-inner font-bold text-left">
                     <div class="flex items-center gap-3">
                       @if (selectedRole() === 'Mesero') {
                         <span class="material-symbols-outlined text-[#ffbd0a] !text-[20px]">restaurant</span>
                         <span class="text-[14px] text-white font-bold">Mesero</span>
                       } @else if (selectedRole() === 'Cajero') {
                         <span class="material-symbols-outlined text-[#ffbd0a] !text-[20px]">payments</span>
                         <span class="text-[14px] text-white font-bold">Cajero</span>
                       } @else if (selectedRole() === 'Administrador') {
                         <span class="material-symbols-outlined text-[#ffbd0a] !text-[20px]">admin_panel_settings</span>
                         <span class="text-[14px] text-white font-bold">Administrador</span>
                       }
                     </div>
                     <span class="material-symbols-outlined text-on-surface-variant transition-transform duration-200" [class.rotate-180]="showRoleDropdown()">expand_more</span>
                   </button>

                   @if (showRoleDropdown()) {
                     <!-- Backdrop to close dropdown -->
                     <button type="button" class="fixed inset-0 z-40 cursor-default bg-transparent w-full h-full border-0 block" (click)="showRoleDropdown.set(false)" aria-label="Cerrar opciones de rol"></button>
                     
                     <div class="absolute left-0 right-0 mt-2 rounded-xl bg-[#242931] border border-white/10 shadow-2xl z-50 py-1.5 overflow-hidden animate-[fadeIn_0.1s_ease-out]">
                       <!-- Option: Mesero -->
                       <button 
                         type="button"
                         (click)="selectRole('Mesero')"
                         class="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-start gap-3.5 cursor-pointer border-b border-white/[0.02]">
                         <div class="w-8 h-8 rounded bg-[#ffbd0a]/10 text-[#ffbd0a] flex items-center justify-center shrink-0 mt-0.5" [class.bg-[#ffbd0a]/20]="selectedRole() === 'Mesero'">
                           <span class="material-symbols-outlined !text-[18px]">restaurant</span>
                         </div>
                         <div class="flex-grow min-w-0">
                           <div class="flex items-center justify-between">
                             <span class="text-[13px] font-bold text-white" [class.text-[#ffbd0a]]="selectedRole() === 'Mesero'">Mesero</span>
                             @if (selectedRole() === 'Mesero') {
                               <span class="material-symbols-outlined text-[#ffbd0a] !text-[16px] font-black">check</span>
                             }
                           </div>
                           <p class="text-[11px] text-on-surface-variant/80 leading-snug mt-0.5">Toma de pedidos rápidos y despacho en mesas.</p>
                         </div>
                       </button>

                       <!-- Option: Cajero -->
                       <button 
                         type="button"
                         (click)="selectRole('Cajero')"
                         class="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-start gap-3.5 cursor-pointer border-b border-white/[0.02]">
                         <div class="w-8 h-8 rounded bg-[#ffbd0a]/10 text-[#ffbd0a] flex items-center justify-center shrink-0 mt-0.5" [class.bg-[#ffbd0a]/20]="selectedRole() === 'Cajero'">
                           <span class="material-symbols-outlined !text-[18px]">payments</span>
                         </div>
                         <div class="flex-grow min-w-0">
                           <div class="flex items-center justify-between">
                             <span class="text-[13px] font-bold text-white" [class.text-[#ffbd0a]]="selectedRole() === 'Cajero'">Cajero</span>
                             @if (selectedRole() === 'Cajero') {
                               <span class="material-symbols-outlined text-[#ffbd0a] !text-[16px] font-black">check</span>
                             }
                           </div>
                           <p class="text-[11px] text-[#b0bac5] leading-snug mt-0.5">Gestión de cobros, cuadre y apertura/cierre de caja.</p>
                         </div>
                       </button>

                       <!-- Option: Administrador -->
                       <button 
                         type="button"
                         (click)="selectRole('Administrador')"
                         class="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-start gap-3.5 cursor-pointer">
                         <div class="w-8 h-8 rounded bg-[#ffbd0a]/10 text-[#ffbd0a] flex items-center justify-center shrink-0 mt-0.5" [class.bg-[#ffbd0a]/20]="selectedRole() === 'Administrador'">
                           <span class="material-symbols-outlined !text-[18px]">admin_panel_settings</span>
                         </div>
                         <div class="flex-grow min-w-0">
                           <div class="flex items-center justify-between">
                             <span class="text-[13px] font-bold text-white" [class.text-[#ffbd0a]]="selectedRole() === 'Administrador'">Administrador</span>
                             @if (selectedRole() === 'Administrador') {
                               <span class="material-symbols-outlined text-[#ffbd0a] !text-[16px] font-black">check</span>
                             }
                           </div>
                           <p class="text-[11px] text-[#b0bac5] leading-snug mt-0.5">Acceso total, reportes avanzados e inventario general.</p>
                         </div>
                       </button>
                     </div>
                   }
                 </div>
                 
                 <p class="text-[12px] font-medium text-on-surface-variant leading-relaxed mt-2.5 mb-6">
                   El rol determina el acceso a la caja registradora, devoluciones y reportes.
                 </p>

                 <p class="block text-[13px] font-bold text-[#f1f3f5] mb-2 tracking-wide">Estado de Cuenta</p>
                 <div class="grid grid-cols-2 gap-2 p-1 bg-[#15181c] rounded-md border border-white/5">
                   <button 
                     type="button"
                     (click)="selectedStatus.set('Activo')"
                     [class]="selectedStatus() === 'Activo' ? 'bg-primary text-[#131517] font-black' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5 font-bold'"
                     class="py-2.5 rounded-md text-[13px] transition-all active:scale-95 cursor-pointer">
                     Activo
                   </button>
                   <button 
                     type="button"
                     (click)="selectedStatus.set('Inactivo')"
                     [class]="selectedStatus() === 'Inactivo' ? 'bg-rose-600 text-white font-black' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5 font-bold'"
                     class="py-2.5 rounded-md text-[13px] transition-all active:scale-95 cursor-pointer">
                     Inactivo
                   </button>
                 </div>
               </div>
             </div>
             
             <div class="mt-8 space-y-3 shrink-0 pt-4 border-t border-white/5">
               <button 
                 (click)="saved.emit({
                   name: staffName.value,
                   dni: staffDni.value,
                   phone: staffPhone.value,
                   role: selectedRole(),
                   shift: selectedShift(),
                   status: selectedStatus()
                 })" 
                 class="w-full bg-[#ffbd0a] hover:bg-[#ffbd0a]/90 text-[#211800] font-black py-3.5 rounded border border-transparent shadow-sm transition-all text-[14px] flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
                 <span class="material-symbols-outlined !text-[20px]">
                   {{ staffToEdit() ? 'save' : 'person_add' }}
                 </span> 
                 {{ staffToEdit() ? 'Guardar Cambios' : 'Registrar Empleado' }}
               </button>
               
               <button (click)="canceled.emit()" class="w-full bg-transparent hover:bg-white/[0.05] text-[#f1f3f5] font-bold py-3.5 rounded border border-white/10 transition-all text-[14px] active:scale-95 cursor-pointer">
                 Cancelar
               </button>
             </div>
           </div>
           
         </div>

       </div>
    </div>
  </div>
  `
})
export class StaffFormComponent {
  staffToEdit = input<{
    id: string;
    name: string;
    role: string;
    dni: string;
    phone: string;
    shift: string;
    status: 'Activo' | 'Inactivo';
  } | null>(null);

  saved = output<{
    name: string;
    dni: string;
    phone: string;
    role: string;
    shift: string;
    status: 'Activo' | 'Inactivo';
  }>();
  canceled = output<void>();

  selectedShift = signal<string>('Mañana');
  selectedRole = signal<string>('Mesero');
  selectedStatus = signal<'Activo' | 'Inactivo'>('Activo');
  showRoleDropdown = signal<boolean>(false);

  constructor() {
    effect(() => {
      const edit = this.staffToEdit();
      if (edit) {
        this.selectedShift.set(edit.shift || 'Mañana');
        this.selectedRole.set(edit.role || 'Mesero');
        this.selectedStatus.set(edit.status || 'Activo');
      } else {
        this.selectedShift.set('Mañana');
        this.selectedRole.set('Mesero');
        this.selectedStatus.set('Activo');
      }
    });
  }

  selectRole(role: string) {
    this.selectedRole.set(role);
    this.showRoleDropdown.set(false);
  }
}
