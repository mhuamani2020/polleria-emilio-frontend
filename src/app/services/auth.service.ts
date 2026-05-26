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

  get accessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_KEY);
  }

  get refreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_KEY);
  }

  setTokens(access: string, refresh: string) {
    sessionStorage.setItem(this.ACCESS_KEY, access);
    sessionStorage.setItem(this.REFRESH_KEY, refresh);
  }

  setSession(session: UserSession) {
    this.currentSession.set(session);
    sessionStorage.setItem('polleria_session', JSON.stringify(session));
  }

  clear() {
    sessionStorage.removeItem(this.ACCESS_KEY);
    sessionStorage.removeItem(this.REFRESH_KEY);
    sessionStorage.removeItem('polleria_session');
    this.currentSession.set(null);
  }

  private loadSession(): UserSession | null {
    const raw = sessionStorage.getItem('polleria_session');
    return raw ? JSON.parse(raw) : null;
  }
}
