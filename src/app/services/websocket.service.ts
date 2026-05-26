import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private token: string | null = null;

  messages = new Subject<{ type: string; data: any; event_id: number }>();

  connect(token: string) {
    this.token = token;
    this.doConnect();
  }

  private doConnect() {
    this.disconnect();
    if (!this.token) return;

    let host = environment.wsUrl;
    if (!host) {
      if (environment.apiUrl.startsWith('http')) {
        host = environment.apiUrl.replace(/^https?:\/\//, '');
      } else {
        host = window.location.host;
      }
    }
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.ws = new WebSocket(`${protocol}//${host}/ws?token=${this.token}`);

    this.ws.onmessage = (event) => {
      try {
        this.messages.next(JSON.parse(event.data));
      } catch { /* ignore parse errors */ }
    };

    this.ws.onclose = () => {
      this.ws = null;
      this.reconnectTimer = setTimeout(() => this.doConnect(), 3000);
    };

    this.ws.onerror = (err) => {
      console.error('[WS] Error de conexión. Verifica que WS_URL esté configurado en producción.', err);
      this.messages.next({ type: 'ws_error', data: { error: 'Error de conexión WebSocket' }, event_id: 0 });
      this.ws?.close();
    };

    this.ws.onopen = () => {
      console.log('[WS] Conectado');
      this.messages.next({ type: 'ws_connected', data: {}, event_id: 0 });
    };
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    this.token = null;
  }
}
