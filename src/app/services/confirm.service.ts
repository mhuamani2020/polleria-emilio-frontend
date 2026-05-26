import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  visible = signal(false);
  title = signal('Confirmar');
  message = signal('¿Estás seguro?');
  confirmText = signal('Confirmar');
  cancelText = signal('Cancelar');
  type = signal<'warning' | 'danger' | 'success'>('warning');

  private resolveRef: ((v: boolean) => void) | null = null;

  confirm(opts: {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'danger' | 'success';
  }): Promise<boolean> {
    this.title.set(opts.title ?? 'Confirmar');
    this.message.set(opts.message ?? '¿Estás seguro?');
    this.confirmText.set(opts.confirmText ?? 'Confirmar');
    this.cancelText.set(opts.cancelText ?? 'Cancelar');
    this.type.set(opts.type ?? 'warning');
    this.visible.set(true);
    return new Promise(resolve => {
      this.resolveRef = resolve;
    });
  }

  accept(): void {
    this.visible.set(false);
    this.resolveRef?.(true);
    this.resolveRef = null;
  }

  reject(): void {
    this.visible.set(false);
    this.resolveRef?.(false);
    this.resolveRef = null;
  }
}
