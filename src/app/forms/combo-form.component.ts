import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-combo-form',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="flex flex-col h-full bg-[#131517] text-on-surface animate-[fadeIn_0.2s_ease-out]">
    <header class="px-10 pt-10 pb-6 shrink-0 border-b border-white/[0.05]">
      <div class="flex items-center gap-2 text-on-surface-variant font-bold text-[13px] mb-4">
        <span>Catálogo</span>
        <span class="material-symbols-outlined !text-[14px]">chevron_right</span>
        <span class="text-[#f1f3f5]">Crear Combo</span>
      </div>
      <h2 class="text-[36px] font-bold text-on-surface tracking-tight mb-1 font-sans leading-none">Crear Nuevo Combo</h2>
      <p class="text-[15px] font-medium text-on-surface-variant mt-2 tracking-wide">Configure un nuevo combo con sus insumos y precio.</p>
    </header>

    <div class="flex-1 overflow-y-auto px-10 py-8 subtle-scrollbar">
       <div class="flex flex-col lg:flex-row gap-8 max-w-[1200px] mx-auto">
         
         <!-- Left Column -->
         <div class="flex-1 space-y-6">
           
           <!-- Info General -->
           <div class="bg-[#1d2229] p-6 rounded-md shadow-sm border border-white/[0.05]">
             <h3 class="text-[18px] font-bold text-on-surface flex items-center gap-3 mb-6">
               <span class="material-symbols-outlined text-[#ffbd0a] !text-[22px]">info</span>
               Información General
             </h3>
             
             <div class="space-y-5">
               <div>
                 <label for="combo-name" class="block text-[13px] font-bold text-[#f1f3f5] mb-1.5">Nombre del Combo</label>
                 <input id="combo-name" type="text" placeholder="Ej: 1 Pollo + Papas + Gaseosa + Chaufa" class="w-full bg-[#111315] border border-white/5 rounded-md px-4 py-3 text-[14px] text-[#f1f3f5] placeholder:text-[#b0bac5]/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner">
               </div>
               
               <div class="grid grid-cols-2 gap-4">
                 <div>
                   <label for="combo-price" class="block text-[13px] font-bold text-on-surface-variant mb-1.5">Precio de Venta (S/)</label>
                   <input id="combo-price" type="number" placeholder="75.00" class="w-full bg-[#111315] border border-white/5 rounded-md px-4 py-3 text-[14px] text-[#f1f3f5] placeholder:text-[#b0bac5]/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner">
                 </div>
                 
                 <div>
                   <label for="combo-category" class="block text-[13px] font-bold text-on-surface-variant mb-1.5">Categoría</label>
                   <div class="relative">
                     <select id="combo-category" class="w-full bg-[#111315] border border-white/5 rounded-md pl-4 pr-10 py-3 text-[14px] text-[#f1f3f5] appearance-none outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer shadow-inner">
                       <option value="combos">Promociones y Combos</option>
                       <option value="pollos">Pollos Enteros</option>
                       <option value="brasas">Menú Brasa</option>
                     </select>
                     <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                   </div>
                 </div>
               </div>
             </div>
           </div>

           <!-- Insumos / Componentes -->
           <div class="bg-[#1d2229] p-6 rounded-md shadow-sm border border-white/[0.05]">
             <h3 class="text-[18px] font-bold text-on-surface flex items-center justify-between mb-6">
               <div class="flex items-center gap-3">
                 <span class="material-symbols-outlined text-[#ffbd0a] !text-[22px]">restaurant_menu</span>
                 Componentes del Combo
               </div>
               <button (click)="addItem()" class="text-[#ffbd0a] hover:text-[#ffcd85] text-[13px] font-bold flex items-center gap-1 transition-colors">
                 <span class="material-symbols-outlined !text-[18px]">add</span> Agregar Insumo
               </button>
             </h3>
             
             <div class="space-y-3">
               @for (item of items(); track $index) {
                 <div class="flex items-center gap-3 p-3 bg-[#111315] rounded border border-white/5 shadow-inner">
                   <div class="flex-1 relative flex items-center bg-[#1d2229] border border-white/10 rounded px-3 py-1.5 pr-8 shadow-inner hover:border-primary/40 focus-within:ring-1 focus-within:ring-primary transition-all">
                     <select (change)="updateItemName($index, $event)" class="w-full bg-transparent text-[14px] text-[#f1f3f5] appearance-none outline-none cursor-pointer">
                       <option class="bg-[#1d2229] text-[#f1f3f5]" value="" disabled [selected]="!item.name">Seleccionar producto...</option>
                       <option class="bg-[#1d2229] text-[#f1f3f5]" value="Pollo Entero" [selected]="item.name === 'Pollo Entero'">Pollo Entero</option>
                       <option class="bg-[#1d2229] text-[#f1f3f5]" value="1/2 Pollo" [selected]="item.name === '1/2 Pollo'">1/2 Pollo</option>
                       <option class="bg-[#1d2229] text-[#f1f3f5]" value="1/4 Pollo" [selected]="item.name === '1/4 Pollo'">1/4 Pollo</option>
                       <option class="bg-[#1d2229] text-[#f1f3f5]" value="Porción de Papas" [selected]="item.name === 'Porción de Papas'">Porción de Papas</option>
                       <option class="bg-[#1d2229] text-[#f1f3f5]" value="Arroz Chaufa" [selected]="item.name === 'Arroz Chaufa'">Arroz Chaufa</option>
                       <option class="bg-[#1d2229] text-[#f1f3f5]" value="Ensalada" [selected]="item.name === 'Ensalada'">Ensalada</option>
                       <option class="bg-[#1d2229] text-[#f1f3f5]" value="Gaseosa 1.5L" [selected]="item.name === 'Gaseosa 1.5L'">Gaseosa 1.5L</option>
                     </select>
                     <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none !text-[18px]">expand_more</span>
                   </div>
                   <div class="w-[80px]">
                     <input type="number" [value]="item.qty" (input)="updateItemQty($index, $event)" class="w-full bg-[#242931] border border-white/10 rounded px-2 py-1.5 text-[14px] text-center text-[#f1f3f5] outline-none">
                   </div>
                   <button (click)="removeItem($index)" class="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 rounded transition-colors">
                     <span class="material-symbols-outlined !text-[18px]">delete</span>
                   </button>
                 </div>
               }
             </div>
             
             <div class="mt-4 p-4 bg-[#242931] border border-[#ffbd0a]/20 rounded text-[13px] text-on-surface-variant flex gap-3">
               <span class="material-symbols-outlined text-[#ffbd0a] !text-[20px]">info</span>
               <p>Los componentes definen qué insumos se descontarán del inventario automáticamente al vender este combo.</p>
             </div>
           </div>
           
         </div>

         <!-- Right Column -->
         <div class="w-full lg:w-[340px] shrink-0 space-y-6">
           
           <div class="bg-[#1d2229] p-6 rounded-md shadow-sm border border-white/[0.05] h-full flex flex-col">
             <h3 class="text-[18px] font-bold text-on-surface flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
               <span class="material-symbols-outlined text-[#f1f3f5] !text-[22px]">image</span>
               Imagen
             </h3>
             
             <div class="flex-1">
               <div class="w-full aspect-video bg-[#111315] border border-dashed border-white/20 rounded-md flex flex-col items-center justify-center hover:bg-white/5 transition-colors cursor-pointer group mb-4">
                 <span class="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors mb-2">add_photo_alternate</span>
                 <span class="text-[13px] font-bold text-on-surface-variant group-hover:text-white transition-colors">Subir Imagen</span>
               </div>
               
               <label for="combo-status" class="block text-[13px] font-bold text-on-surface-variant mb-1.5 mt-8">Estado</label>
               <div class="relative">
                 <select id="combo-status" class="w-full bg-[#111315] border border-white/5 rounded-md pl-4 pr-10 py-3 text-[14px] text-emerald-400 font-bold appearance-none outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer shadow-inner">
                   <option value="active">Activo (Disponible en POS)</option>
                   <option value="inactive">Inactivo</option>
                 </select>
                 <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
               </div>
             </div>
             
             <div class="mt-8 space-y-3 shrink-0 pt-4 border-t border-white/5">
               <button (click)="saved.emit()" class="w-full bg-[#ffbd0a] hover:bg-[#ffbd0a]/90 text-[#211800] font-bold py-3.5 rounded border border-transparent shadow-sm transition-all text-[14px] flex items-center justify-center gap-2 active:scale-95">
                 <span class="material-symbols-outlined !text-[20px]">save</span> Guardar Combo
               </button>
               <button (click)="canceled.emit()" class="w-full bg-transparent hover:bg-white/[0.05] text-[#f1f3f5] font-bold py-3.5 rounded border border-white/10 transition-all text-[14px] active:scale-95">
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
export class ComboFormComponent {
  saved = output<void>();
  canceled = output<void>();

  items = signal<{name: string, qty: number}[]>([
    { name: 'Pollo Entero', qty: 1 },
    { name: 'Porción de Papas', qty: 1 },
    { name: 'Gaseosa 1.5L', qty: 1 }
  ]);

  addItem() {
    this.items.update(list => [...list, { name: '', qty: 1 }]);
  }

  removeItem(index: number) {
    this.items.update(list => {
      const newList = [...list];
      newList.splice(index, 1);
      return newList;
    });
  }

  updateItemName(index: number, event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.items.update(list => {
      const newList = [...list];
      newList[index] = { ...newList[index], name: value };
      return newList;
    });
  }

  updateItemQty(index: number, event: Event) {
    const qty = parseInt((event.target as HTMLInputElement).value, 10) || 1;
    this.items.update(list => {
      const newList = [...list];
      newList[index] = { ...newList[index], qty };
      return newList;
    });
  }
}
