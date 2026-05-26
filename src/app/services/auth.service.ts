import { Injectable, signal } from '@angular/core';

export interface UserSession {
  role: 'admin' | 'cajero' | 'mesero';
  sedeId: string;
  username: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ACCESS_KEY = 'polleria_access_token';
  private readonly REFRESH_KEY = 'polleria_refresh_token';

  currentSession = signal<UserSession | null>(this.loadSession());

  private ss(): Storage | null {
    try {
      return typeof window !== 'undefined' ? window.sessionStorage : null;
    } catch {
      return null;
    }
  }

  get accessToken(): string | null {
    return this.ss()?.getItem(this.ACCESS_KEY) ?? null;
  }

  get refreshToken(): string | null {
    return this.ss()?.getItem(this.REFRESH_KEY) ?? null;
  }

  setTokens(access: string, refresh: string) {
    this.ss()?.setItem(this.ACCESS_KEY, access);
    this.ss()?.setItem(this.REFRESH_KEY, refresh);
  }

  setSession(session: UserSession) {
    this.currentSession.set(session);
    this.ss()?.setItem('polleria_session', JSON.stringify(session));
  }

  clear() {
    this.ss()?.removeItem(this.ACCESS_KEY);
    this.ss()?.removeItem(this.REFRESH_KEY);
    this.ss()?.removeItem('polleria_session');
    this.currentSession.set(null);
  }

  private loadSession(): UserSession | null {
    const raw = this.ss()?.getItem('polleria_session');
    return raw ? JSON.parse(raw) : null;
  }
}
