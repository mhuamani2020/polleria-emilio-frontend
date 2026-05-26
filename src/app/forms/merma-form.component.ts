import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-merma-form',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="flex flex-col h-full bg-[#131517] text-on-surface animate-[fadeIn_0.2s_ease-out]">
    <header class="px-10 pt-10 pb-6 shrink-0">
      <div class="flex items-center gap-2 text-on-surface-variant font-bold text-[13px] mb-4">
        <span>Inventario</span>
        <span class="material-symbols-outlined !text-[14px]">chevron_right</span>
        <span class="text-[#f1f3f5]">Registro de Mermas</span>
      </div>
      <h2 class="text-[36px] font-bold text-on-surface tracking-tight mb-1 font-sans leading-none">Registro de Mermas</h2>
      <p class="text-[15px] font-medium text-on-surface-variant mt-2 tracking-wide">Descuente inventario por pérdida, vencimiento o error en cocina.</p>
    </header>

    <div class="flex-1 overflow-y-auto px-10 pb-10 subtle-scrollbar">
       <div class="flex flex-col lg:flex-row gap-6 max-w-[1000px]">
          
          <!-- Left Column -->
          <div class="flex-1 space-y-6">
            
            <div class="bg-[#1d2229] p-6 rounded-md border border-white/[0.04]">
              <h3 class="text-[18px] font-bold text-on-surface flex items-center gap-3 mb-6">
                <span class="material-symbols-outlined text-error !text-[22px]">delete_sweep</span>
                Detalle de la Merma
              </h3>
              
              <div class="space-y-6">
                <div>
                  <label for="merma-item" class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-2">Seleccionar Insumo/Producto</label>
                  <div class="relative">
                    <select id="merma-item" [value]="selectedItemId()" (change)="selectedItemId.set($any($event.target).value)" class="w-full bg-[#111315] border border-white/10 rounded-xl pl-4 pr-10 py-3.5 text-[14px] text-[#f1f3f5] font-bold appearance-none outline-none focus:ring-1 focus:ring-error focus:border-error transition-all cursor-pointer hover:border-white/20 shadow-inner">
                      <option class="bg-[#1d2229] text-[#f1f3f5] font-bold" value="" disabled>Seleccione un item del inventario</option>
                      @for (item of inventoryItems(); track item.inventoryId) {
                        <option class="bg-[#1d2229] text-[#f1f3f5] font-bold" [value]="item.inventoryId">{{ item.productName }}</option>
                      }
                    </select>
                    <span class="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/80 pointer-events-none !text-[20px]">expand_more</span>
                  </div>
                </div>
                
                <div class="flex gap-6">
                  <div class="flex-1">
                    <label for="merma-qty" class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-2">Cantidad Pérdida</label>
                    <input id="merma-qty" type="number" [value]="quantity()" (input)="quantity.set($any($event.target).value)" placeholder="0.00" class="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3.5 text-[14px] text-[#f1f3f5] font-bold placeholder:text-on-surface-variant/50 outline-none focus:ring-1 focus:ring-error focus:border-error transition-all hover:border-white/20 shadow-inner">
                  </div>
                  
                  <div class="flex-1">
                    <label for="merma-unit" class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-2">Unidad de Medida</label>
                    <div class="relative">
                      <select id="merma-unit" [value]="unit()" (change)="unit.set($any($event.target).value)" class="w-full bg-[#111315] border border-white/10 rounded-xl pl-4 pr-10 py-3.5 text-[14px] text-[#f1f3f5] font-bold appearance-none outline-none focus:ring-1 focus:ring-error focus:border-error transition-all cursor-pointer hover:border-white/20 shadow-inner">
                        <option class="bg-[#1d2229] text-[#f1f3f5] font-bold" value="unidades">Unidades</option>
                        <option class="bg-[#1d2229] text-[#f1f3f5] font-bold" value="kg">Kilogramos</option>
                        <option class="bg-[#1d2229] text-[#f1f3f5] font-bold" value="litros">Litros</option>
                      </select>
                      <span class="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/80 pointer-events-none !text-[20px]">expand_more</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-2.5">Motivo Principal</span>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                     <label class="cursor-pointer">
                       <input type="radio" name="motivo" class="peer sr-only" (change)="reason.set('Quemado / Roto')" [checked]="reason() === 'Quemado / Roto'">
                       <div class="text-center py-3 px-2 border border-white/10 rounded-md text-[12px] font-bold text-on-surface-variant peer-checked:bg-error/20 peer-checked:text-error peer-checked:border-error/50 transition-all">Quemado / Roto</div>
                     </label>
                     <label class="cursor-pointer">
                       <input type="radio" name="motivo" class="peer sr-only" (change)="reason.set('Vencimiento')" [checked]="reason() === 'Vencimiento'">
                       <div class="text-center py-3 px-2 border border-white/10 rounded-md text-[12px] font-bold text-on-surface-variant peer-checked:bg-error/20 peer-checked:text-error peer-checked:border-error/50 transition-all">Vencimiento</div>
                     </label>
                     <label class="cursor-pointer">
                       <input type="radio" name="motivo" class="peer sr-only" (change)="reason.set('Calidad Mala')" [checked]="reason() === 'Calidad Mala'">
                       <div class="text-center py-3 px-2 border border-white/10 rounded-md text-[12px] font-bold text-on-surface-variant peer-checked:bg-error/20 peer-checked:text-error peer-checked:border-error/50 transition-all">Calidad Mala</div>
                     </label>
                     <label class="cursor-pointer">
                       <input type="radio" name="motivo" class="peer sr-only" (change)="reason.set('Pruebas')" [checked]="reason() === 'Pruebas'">
                       <div class="text-center py-3 px-2 border border-white/10 rounded-md text-[12px] font-bold text-on-surface-variant peer-checked:bg-error/20 peer-checked:text-error peer-checked:border-error/50 transition-all">Pruebas</div>
                     </label>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          <!-- Right Column -->
          <div class="w-full lg:w-[340px] shrink-0">
            
            <div class="bg-[#1d2229] p-6 rounded-md border border-white/[0.04] h-full flex flex-col">
              <h3 class="text-[18px] font-bold text-on-surface flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <span class="material-symbols-outlined text-[#f1f3f5] !text-[22px]">edit_note</span>
                Observaciones
              </h3>
              
              <div class="flex-1 flex flex-col">
                <label for="merma-notes" class="block text-[11px] font-black text-on-surface-variant tracking-[0.1em] uppercase mb-2">Detalles Adicionales</label>
                <textarea id="merma-notes" [value]="notes()" (input)="notes.set($any($event.target).value)" rows="6" placeholder="Opcional. Agregue detalles sobre cómo o por qué ocurrió esta merma..." class="w-full flex-1 min-h-[120px] bg-[#111315] border border-white/10 rounded-xl p-4 text-[14px] text-[#f1f3f5] font-bold placeholder:text-on-surface-variant/40 outline-none focus:ring-1 focus:ring-error focus:border-error transition-all hover:border-white/20 shadow-inner resize-none"></textarea>
              </div>
              
              <div class="mt-8 space-y-3 shrink-0 pt-4 border-t border-white/5">
                <button (click)="openConfirm()" class="w-full bg-error hover:bg-error/90 text-on-error font-bold py-3.5 rounded border border-transparent shadow-sm transition-all text-[14px] flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
                  <span class="material-symbols-outlined !text-[20px]">check_circle</span> Registrar Merma
                </button>
                <button (click)="canceled.emit()" class="w-full bg-transparent hover:bg-white/[0.05] text-[#f1f3f5] font-bold py-3.5 rounded border border-white/10 transition-all text-[14px] active:scale-95 cursor-pointer">
                  Cancelar
                </button>
              </div>
            </div>
            
          </div>

       </div>
    </div>

    <!-- Confirmation Modal inside code view -->
    @if (showConfirmModal()) {
      <div id="merma-confirm-modal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] p-4">
        <div class="bg-[#1d2229] border border-white/10 rounded-xl shadow-2xl p-8 max-w-[420px] w-full transform transition-all animate-[slideUp_0.3s_ease-out]">
          
          <div class="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 shadow-inner mx-auto border border-emerald-500/20">
            <span class="material-symbols-outlined !text-[32px]">delete_sweep</span>
          </div>

          <h3 class="text-[24px] font-black text-center text-white mb-2 leading-tight">
            ¿Confirmar Registro?
          </h3>
          
          <p class="text-center text-on-surface-variant font-medium text-[15px] mb-8 leading-snug tracking-wide">
            Estás a punto de registrar la siguiente merma y descontarla del stock:
          </p>

          <div class="bg-[#131517] border border-white/5 rounded-lg p-5 mb-8 space-y-3.5 text-left">
            <div class="flex justify-between items-start">
              <span class="text-[13px] text-on-surface-variant font-bold uppercase tracking-wider uppercase">Insumo</span>
              <span class="text-[14px] font-black text-white text-right max-w-[200px] truncate" [title]="getItemName()">
                {{ getItemName() }}
              </span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-[13px] text-on-surface-variant font-bold uppercase tracking-wider font-bold">Cantidad</span>
              <span class="text-[15px] font-black text-emerald-500">
                {{ quantity() || '0.00' }} {{ unit() }}
              </span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-[13px] text-on-surface-variant font-bold uppercase tracking-wider font-bold">Motivo</span>
              <span class="text-[13px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/25">
                {{ reason() }}
              </span>
            </div>

            @if (notes()) {
              <div class="pt-3 border-t border-white/5">
                <span class="text-[12px] text-on-surface-variant font-bold uppercase tracking-wider block mb-1">Notas</span>
                <p class="text-[13px] text-[#b0bac5] bg-[#1a1d22] px-3 py-2 rounded border border-white/5 italic line-clamp-2">
                  "{{ notes() }}"
                </p>
              </div>
            }
          </div>

          @if (!selectedItemId() || !quantity() || +quantity() <= 0) {
            <div class="bg-red-500/10 border border-red-500/20 rounded-md p-3.5 mb-6 text-center">
              <p class="text-[13px] font-bold text-red-400">
                ⚠️ Por favor, complete la selección del insumo y la cantidad antes de proceder.
              </p>
            </div>
          }

          <div class="flex items-center gap-4">
            <button (click)="showConfirmModal.set(false)" class="flex-1 bg-surface-variant hover:bg-white/10 text-white font-bold py-3.5 rounded-lg transition-colors border border-white/5 active:scale-95 cursor-pointer">
              Cancelar
            </button>
            <button (click)="submitMerma()" 
                    [disabled]="!selectedItemId() || !quantity() || +quantity() <= 0"
                    class="flex-1 bg-emerald-500 hover:bg-emerald-400 text-[#131517] font-bold py-3.5 rounded-lg transition-colors shadow-md active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    }
  </div>
  `
})
export class MermaFormComponent {
  inventoryItems = input<{ inventoryId: string; productName: string }[]>([]);
  saved = output<{ inventory_id: string; quantity: number; unit: string; reason: string; notes: string }>();
  canceled = output<void>();

  selectedItemId = signal<string>('');
  quantity = signal<string>('');
  unit = signal<string>('unidades');
  reason = signal<string>('Quemado / Roto');
  notes = signal<string>('');

  showConfirmModal = signal<boolean>(false);

  getItemName(): string {
    const item = this.inventoryItems().find(i => i.inventoryId === this.selectedItemId());
    return item?.productName || 'No seleccionado';
  }

  openConfirm() {
    this.showConfirmModal.set(true);
  }

  submitMerma() {
    this.showConfirmModal.set(false);
    this.saved.emit({
      inventory_id: this.selectedItemId(),
      quantity: +this.quantity(),
      unit: this.unit(),
      reason: this.reason(),
      notes: this.notes(),
    });
  }
}
