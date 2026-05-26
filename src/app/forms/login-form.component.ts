import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LoginCredentials {
  username: string;
  password: string;
  role: 'admin' | 'cajero' | 'mesero';
  sedeId: string;
  displayName: string;
}

@Component({
  selector: 'app-login-form',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="flex h-screen w-full bg-[#131517] text-on-surface font-sans animate-[fadeIn_0.3s_ease-out] relative overflow-hidden">
    <div class="absolute inset-0 z-0 opacity-20 pointer-events-none" style="background-image: radial-gradient(circle at 10% 20%, rgba(255, 189, 10, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(59, 61, 185, 0.2) 0%, transparent 40%);"></div>

    <div class="flex-1 flex items-center justify-center relative z-10 w-full h-full p-4">
      <div class="w-full max-w-[440px] bg-[#1d2229] border border-white/[0.04] p-8 rounded-xl shadow-2xl relative overflow-hidden">
        <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#ffbd0a] to-transparent opacity-50"></div>
        <div class="flex flex-col items-center text-center mb-6">
          <div class="w-14 h-14 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold shadow-lg mb-4 border border-primary/20">
            <span class="material-symbols-outlined !text-[32px]">restaurant</span>
          </div>
          <h1 class="text-[28px] leading-tight font-black text-white tracking-tight drop-shadow-sm">Rotisserie Pro</h1>
          <p class="text-[13px] font-medium text-on-surface-variant mt-1.5 tracking-wide">Seleccione un perfil de acceso rápido para probar</p>
        </div>

        @if (errorMessage()) {
          <div class="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-[12px] font-medium">
            {{ errorMessage() }}
          </div>
        }

        <div class="space-y-3 mb-6">
          <span class="block text-[11px] font-black text-on-surface-variant tracking-wider uppercase mb-1">Perfiles de Prueba</span>
          <div class="grid grid-cols-1 gap-2.5">
            <button
              id="preset-admin"
              type="button"
              (click)="selectPreset('admin', '1', 'Miguel Rivas (Administrador)', 'admin.central')"
              [class]="selectedRole() === 'admin' ? 'border-[#ffbd0a] bg-[#ffbd0a]/5 text-[#ffbd0a]' : 'border-white/5 bg-[#242931] text-on-surface hover:bg-white/[0.02]'"
              class="flex items-center gap-3 p-3 rounded-lg border text-left transition-all active:scale-[0.98]">
              <span class="material-symbols-outlined !text-[20px]">shield_person</span>
              <div class="flex-1 min-w-0">
                <div class="text-[13px] font-black">Administrador</div>
                <div class="text-[11px] opacity-80 truncate">Acceso completo • Sede Central</div>
              </div>
              @if (selectedRole() === 'admin') {
                <span class="material-symbols-outlined !text-[18px]">radio_button_checked</span>
              } @else {
                <span class="material-symbols-outlined !text-[18px] opacity-40">radio_button_unchecked</span>
              }
            </button>

            <button
              id="preset-cajero"
              type="button"
              (click)="selectPreset('cajero', '1', 'Carlos Mendoza (Cajero)', 'cajero.central')"
              [class]="selectedRole() === 'cajero' ? 'border-[#ffbd0a] bg-[#ffbd0a]/5 text-[#ffbd0a]' : 'border-white/5 bg-[#242931] text-on-surface hover:bg-white/[0.02]'"
              class="flex items-center gap-3 p-3 rounded-lg border text-left transition-all active:scale-[0.98]">
              <span class="material-symbols-outlined !text-[20px]">point_of_sale</span>
              <div class="flex-1 min-w-0">
                <div class="text-[13px] font-black">Cajero (Carlos M.)</div>
                <div class="text-[11px] opacity-80 truncate">POS Reservado • Sede Central</div>
              </div>
              @if (selectedRole() === 'cajero') {
                <span class="material-symbols-outlined !text-[18px]">radio_button_checked</span>
              } @else {
                <span class="material-symbols-outlined !text-[18px] opacity-40">radio_button_unchecked</span>
              }
            </button>

            <button
              id="preset-mesero"
              type="button"
              (click)="selectPreset('mesero', '1', 'Ana Lucía (Mesero)', 'mesero.central')"
              [class]="selectedRole() === 'mesero' ? 'border-[#ffbd0a] bg-[#ffbd0a]/5 text-[#ffbd0a]' : 'border-white/5 bg-[#242931] text-on-surface hover:bg-white/[0.02]'"
              class="flex items-center gap-3 p-3 rounded-lg border text-left transition-all active:scale-[0.98]">
              <span class="material-symbols-outlined !text-[20px]">restaurant_menu</span>
              <div class="flex-1 min-w-0">
                <div class="text-[13px] font-black">Mesero (Ana Lucía)</div>
                <div class="text-[11px] opacity-80 truncate">Orden de mesas • Sede Central</div>
              </div>
              @if (selectedRole() === 'mesero') {
                <span class="material-symbols-outlined !text-[18px]">radio_button_checked</span>
              } @else {
                <span class="material-symbols-outlined !text-[18px] opacity-40">radio_button_unchecked</span>
              }
            </button>
          </div>
        </div>

        <form (submit)="$event.preventDefault(); submitLogin()" class="space-y-4">
          <div>
            <label for="login-user" class="block text-[11px] font-bold text-on-surface-variant mb-1.5 tracking-wide uppercase">Usuario</label>
            <input id="login-user" type="text" [value]="selectedUsername()" readonly class="w-full bg-[#111315] border border-white/5 rounded-md px-3.5 py-2.5 text-[14px] text-on-surface-variant outline-none cursor-not-allowed" autocomplete="off">
          </div>

          <div>
            <label for="login-password" class="block text-[11px] font-bold text-on-surface-variant mb-1.5 tracking-wide uppercase">Contraseña</label>
            <input id="login-password" type="password" placeholder="••••••••" class="w-full bg-[#242931] border border-white/5 rounded-md px-3.5 py-2.5 text-[14px] text-[#f1f3f5] placeholder:text-on-surface-variant/40 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner" autocomplete="off">
          </div>

          <button id="btn-login-submit" type="submit" class="w-full bg-[#ffbd0a] hover:bg-[#ffcd85] text-[#2a1d00] font-black py-3.5 rounded-md shadow-md hover:shadow-lg transition-all text-[15px] mt-2 flex justify-center items-center gap-2 active:scale-95 group border border-[#ffbd0a]/20">
            Ingresar al Sistema <span class="material-symbols-outlined !text-[20px] group-hover:translate-x-1 transition-transform">login</span>
          </button>
        </form>

        <div class="mt-6 pt-4 border-t border-white/[0.04] text-center">
           <p class="text-[11px] text-on-surface-variant opacity-85">Soporte Rotisserie Pro • Licencia Activa</p>
        </div>
      </div>
    </div>
  </div>
  `
})
export class LoginFormComponent {
  loginSuccess = output<LoginCredentials>();

  selectedRole = signal<'admin' | 'cajero' | 'mesero'>('admin');
  selectedSedeId = signal<string>('1');
  selectedUsername = signal<string>('Miguel Rivas (Administrador)');
  selectedLoginName = signal<string>('admin.central');
  errorMessage = signal<string>('');

  selectPreset(role: 'admin' | 'cajero' | 'mesero', sedeId: string, displayName: string, loginName: string) {
    this.selectedRole.set(role);
    this.selectedSedeId.set(sedeId);
    this.selectedUsername.set(displayName);
    this.selectedLoginName.set(loginName);
    this.errorMessage.set('');
  }

  submitLogin() {
    this.loginSuccess.emit({
      username: this.selectedLoginName(),
      password: 'Polleria123!',
      role: this.selectedRole(),
      sedeId: this.selectedSedeId(),
      displayName: this.selectedUsername()
    });
  }
}
