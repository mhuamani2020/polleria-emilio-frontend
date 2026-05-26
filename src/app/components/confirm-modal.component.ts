import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../services/confirm.service';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (service.visible()) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] p-4">
        <div class="bg-[#1d2229] border border-white/10 rounded-xl shadow-2xl p-8 max-w-[420px] w-full transform transition-all animate-[slideUp_0.3s_ease-out]">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-inner mx-auto"
               [class.bg-[#ffbd0a]/10]="service.type() === 'warning'"
               [class.text-[#ffbd0a]]="service.type() === 'warning'"
               [class.border]="true"
               [class.border-[#ffbd0a]/20]="service.type() === 'warning'"
               [class.bg-rose-500/10]="service.type() === 'danger'"
               [class.text-rose-500]="service.type() === 'danger'"
               [class.border-rose-500/20]="service.type() === 'danger'"
               [class.bg-emerald-500/10]="service.type() === 'success'"
               [class.text-emerald-500]="service.type() === 'success'"
               [class.border-emerald-500/20]="service.type() === 'success'">
            <span class="material-symbols-outlined !text-[32px]">
              @if (service.type() === 'warning') { warning }
              @if (service.type() === 'danger') { error }
              @if (service.type() === 'success') { check_circle }
            </span>
          </div>
          <h3 class="text-[24px] font-black text-center text-white mb-2 leading-tight">{{ service.title() }}</h3>
          <p class="text-center text-on-surface-variant font-medium text-[15px] mb-8 leading-snug tracking-wide">{{ service.message() }}</p>
          <div class="flex items-center gap-4">
            <button (click)="service.reject()"
                    class="flex-1 bg-surface-variant hover:bg-white/10 text-white font-bold py-3.5 rounded-lg transition-colors border border-white/5 active:scale-95">
              {{ service.cancelText() }}
            </button>
            <button (click)="service.accept()"
                    class="flex-1 font-bold py-3.5 rounded-lg transition-colors shadow-md active:scale-95 text-[#131517]"
                    [class.bg-[#ffbd0a]]="service.type() === 'warning'"
                    [class.hover:bg-[#ffcd85]]="service.type() === 'warning'"
                    [class.bg-rose-600]="service.type() === 'danger'"
                    [class.hover:bg-rose-500]="service.type() === 'danger'"
                    [class.text-white]="service.type() === 'danger'"
                    [class.bg-emerald-500]="service.type() === 'success'"
                    [class.hover:bg-emerald-400]="service.type() === 'success'"
                    [class.text-white]="service.type() === 'success'">
              {{ service.confirmText() }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmModalComponent {
  service = inject(ConfirmService);
}
