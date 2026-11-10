import { Injectable, signal } from '@angular/core';
import { translate } from '../i18n/translate';

export type ToastType = 'error' | 'success' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

const DEFAULT_DURATION_MS = 5000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _nextId = 0;
  private readonly _toasts = signal<readonly Toast[]>([]);

  readonly toasts = this._toasts.asReadonly();

  /** Mostra un toast; `messageKey` è una chiave di it.json. Sparisce da solo dopo `duration` ms. */
  show(type: ToastType, messageKey: string, duration = DEFAULT_DURATION_MS): void {
    const id = this._nextId++;
    this._toasts.update((toasts) => [...toasts, { id, type, message: translate(messageKey) }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  error(messageKey: string): void {
    this.show('error', messageKey);
  }

  success(messageKey: string): void {
    this.show('success', messageKey);
  }

  dismiss(id: number): void {
    this._toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
}
