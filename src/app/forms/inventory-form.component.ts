import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-form',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="flex flex-col h-full bg-surface-container-lowest animate-[fadeIn_0.2s_ease-out]">
    <!-- Top Alert bar -->
    <div class="w-full bg-[#930006] text-[#ffdad4] flex items-center justify-between px-6 py-2 shrink-0">
      <div class="flex items-center gap-3 font-bold text-[14px]">
        <span class="material-symbols-outlined !text-[20px]">warning</span>
        Alerta de stock crítico
      </div>
      <button class="flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
        <span class="material-symbols-outlined !text-[20px]">close</span>
      </button>
    </div>

    <!-- Header -->
    <header class="flex justify-between items-start px-10 pt-8 pb-6 shrink-0 border-b border-white/[0.05]">
      <div>
        <h2 class="text-[32px] font-bold text-on-surface tracking-tight mb-1 font-sans leading-none">Registro y Control de Inventario</h2>
        <p class="text-[15px] font-medium text-on-surface-variant">Gestión de insumos y configuración de mermas</p>
      </div>
      <button (click)="merma.emit()" class="bg-surface-container-high hover:bg-surface-variant text-on-surface font-bold px-5 py-2.5 rounded-md border border-white/10 shadow-sm flex items-center gap-2 transition-all active:scale-95 text-[14px]">
        <span class="material-symbols-outlined !text-[18px]">delete_sweep</span> Registro de mermas
      </button>
    </header>

    <div class="flex-1 overflow-y-auto p-10 subtle-scrollbar">
       <div class="flex flex-col lg:flex-row gap-8 max-w-[1200px]">
         
         <!-- Left Column -->
         <div class="flex-1 space-y-6">
           
           <!-- Detalle de Ingreso -->
           <div class="bg-[#1d2229] p-6 rounded-md shadow-sm border border-white/[0.05]">
             <h3 class="text-[18px] font-bold text-on-surface flex items-center gap-3 mb-6">
               <span class="material-symbols-outlined text-on-surface-variant !text-[22px]">add_box</span>
               Detalle de Ingreso
             </h3>
             
             <div class="space-y-6">
               <div>
                 <label for="insumo-name" class="block text-[11px] font-black text-[#ffbd0a] tracking-[0.1em] uppercase mb-2">Nombre del Insumo</label>
                 <input id="insumo-name" type="text" placeholder="Ej: Pollo entero" class="w-full bg-[#111315] border border-white/5 rounded-md px-4 py-3 text-[14px] text-[#f1f3f5] placeholder:text-[#b0bac5]/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all">
               </div>

               <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 <div class="col-span-1">
                   <label for="insumo-qty" class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-2">Cantidad</label>
                   <input id="insumo-qty" type="number" placeholder="0.00" class="w-full bg-[#111315] border border-white/5 rounded-md px-4 py-3 text-[14px] text-[#f1f3f5] placeholder:text-[#b0bac5]/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all">
                 </div>
                 <div class="col-span-1">
                   <label for="insumo-unit" class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-2">Und. de Medida</label>
                   <div class="relative">
                     <select id="insumo-unit" class="w-full bg-[#111315] border border-white/10 rounded-xl pl-4 pr-10 py-3.5 text-[14px] text-[#f1f3f5] font-bold appearance-none outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer hover:border-white/20 shadow-inner">
                       <option class="bg-[#1d2229] text-[#f1f3f5] font-bold" value="ud">Unidades</option>
                       <option class="bg-[#1d2229] text-[#f1f3f5] font-bold" value="kg">Kilogramos</option>
                       <option class="bg-[#1d2229] text-[#f1f3f5] font-bold" value="litros">Litros</option>
                     </select>
                     <span class="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/80 pointer-events-none !text-[20px]">expand_more</span>
                   </div>
                 </div>
                 
                 <div class="col-span-1">
                   <label for="insumo-cat" class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-2">Categoría</label>
                   <div class="relative">
                     <select id="insumo-cat" class="w-full bg-[#111315] border border-white/10 rounded-xl pl-4 pr-10 py-3.5 text-[14px] text-[#f1f3f5] font-bold appearance-none outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer hover:border-white/20 shadow-inner">
                       <option class="bg-[#1d2229] text-[#f1f3f5] font-bold" value="pollos">Pollos</option>
                       <option class="bg-[#1d2229] text-[#f1f3f5] font-bold" value="insumos">Insumos</option>
                       <option class="bg-[#1d2229] text-[#f1f3f5] font-bold" value="gaseosas">Bebidas</option>
                     </select>
                     <span class="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/80 pointer-events-none !text-[20px]">expand_more</span>
                   </div>
                 </div>
                 
                 <div class="col-span-1">
                   <label for="insumo-min" class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-2">Stock Mínimo</label>
                   <input id="insumo-min" type="number" placeholder="20" class="w-full bg-[#111315] border border-white/5 rounded-md px-4 py-3 text-[14px] text-[#f1f3f5] placeholder:text-[#b0bac5]/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all">
                 </div>
               </div>
               
               <div class="grid grid-cols-2 gap-4">
                 <div>
                   <label for="insumo-cost" class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-2">Costo Total (S/)</label>
                   <input id="insumo-cost" type="number" placeholder="0.00" class="w-full bg-[#111315] border border-white/5 rounded-md px-4 py-3 text-[14px] text-[#f1f3f5] placeholder:text-[#b0bac5]/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all">
                 </div>
                 <div>
                   <label for="insumo-provider" class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-2">Proveedor</label>
                   <div class="relative">
                     <select id="insumo-provider" class="w-full bg-[#111315] border border-white/10 rounded-xl pl-4 pr-10 py-3.5 text-[14px] text-[#f1f3f5] font-bold appearance-none outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer hover:border-white/20 shadow-inner">
                       <option class="bg-[#1d2229] text-[#f1f3f5] font-bold" value="" disabled selected>Seleccionar</option>
                       <option class="bg-[#1d2229] text-[#f1f3f5] font-bold" value="1">Avícola San Fernando</option>
                       <option class="bg-[#1d2229] text-[#f1f3f5] font-bold" value="2">Distribuidora del Norte</option>
                     </select>
                     <span class="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/80 pointer-events-none !text-[20px]">expand_more</span>
                   </div>
                 </div>
               </div>

               <div class="grid grid-cols-2 gap-4">
                 <div>
                   <label for="insumo-date" class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-2">Fecha de Ingreso</label>
                   <input id="insumo-date" type="date" class="w-full bg-[#111315] border border-white/5 rounded-md px-4 py-3 text-[14px] text-[#f1f3f5] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all">
                 </div>
                 <div>
                   <label for="insumo-exp" class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-2">Vencimiento</label>
                   <input id="insumo-exp" type="date" class="w-full bg-[#111315] border border-white/5 rounded-md px-4 py-3 text-[14px] text-[#f1f3f5] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all">
                 </div>
               </div>

             </div>
           </div>

           <!-- Configuración de Conversión -->
           <div class="bg-[#1d2229] p-6 rounded-md shadow-sm border border-white/[0.05]">
             <h3 class="text-[18px] font-bold text-on-surface flex items-center gap-3 mb-6">
               <span class="material-symbols-outlined text-on-surface-variant !text-[22px]">settings</span>
               Configuración de Conversión
             </h3>
             
             <p class="block text-[13px] font-bold text-[#b0bac5] mb-2">Regla de Conversión de Unidades</p>
             <div class="flex items-center gap-3 mb-3">
               <input type="number" value="1" class="w-20 bg-[#111315] border border-white/5 rounded-md px-3 py-2.5 text-[14px] text-center text-[#f1f3f5] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all">
               <span class="text-[14px] font-bold text-[#b0bac5]">unidad =</span>
               <input type="number" value="4" class="w-20 bg-[#111315] border border-white/5 rounded-md px-3 py-2.5 text-[14px] text-center text-[#f1f3f5] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all">
               <span class="text-[14px] font-bold text-[#b0bac5]">porciones</span>
             </div>
             
             <p class="text-[13px] text-[#b0bac5] flex items-center gap-1.5">
               <span class="material-symbols-outlined !text-[16px]">info</span> Ej: 1 pollo = 4 cuartos
             </p>
           </div>
           
         </div>

         <!-- Right Column -->
         <div class="w-full lg:w-[340px] shrink-0 space-y-6">
           
           <div class="bg-[#1d2229] p-6 rounded-md shadow-sm border border-white/[0.05] h-full flex flex-col">
             <h3 class="text-[18px] font-bold text-on-surface flex items-center gap-3 mb-8">
               <span class="material-symbols-outlined text-on-surface-variant !text-[22px]">tune</span>
               Opciones
             </h3>
             
             <div class="space-y-6 flex-1">
               <div class="flex items-start justify-between gap-4">
                 <span class="text-[14px] font-bold text-on-surface text-[#f1f3f5]">Descuento automático en combos</span>
                 <!-- Toggle Switch -->
                 <label for="toggle-descuento" class="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                   <input id="toggle-descuento" type="checkbox" checked class="sr-only peer">
                   <div class="w-[42px] h-[22px] bg-[#30373f] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ffbd0a] border border-white/5"></div>
                 </label>
               </div>
               
               <div class="flex items-start justify-between gap-4">
                 <span class="text-[14px] font-bold text-on-surface text-[#f1f3f5]">Notificar bajo stock</span>
                 <!-- Toggle Switch -->
                 <label for="toggle-notificar" class="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                   <input id="toggle-notificar" type="checkbox" checked class="sr-only peer">
                   <div class="w-[42px] h-[22px] bg-[#30373f] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ffbd0a] border border-white/5"></div>
                 </label>
               </div>
             </div>
             
             <div class="mt-8 space-y-3 shrink-0">
               <button (click)="canceled.emit()" class="w-full bg-[#111315] hover:bg-white/[0.05] text-[#f1f3f5] font-bold py-3 rounded-md border border-white/5 transition-all text-[14px]">Cancelar</button>
               <button (click)="saved.emit()" class="w-full bg-[#ffbd0a] hover:bg-[#ffbd0a]/90 text-[#211800] font-bold py-3 rounded-md shadow-sm transition-all text-[14px] flex items-center justify-center gap-2">
                 <span class="material-symbols-outlined !text-[18px]">save</span> Actualizar Stock
               </button>
             </div>
           </div>
           
         </div>

       </div>
    </div>
  </div>
  `
})
export class InventoryFormComponent {
  saved = output<void>();
  canceled = output<void>();
  merma = output<void>();
}
