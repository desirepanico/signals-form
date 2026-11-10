import { Component, inject } from '@angular/core';
import { ToastService, ToastType } from '../../services/toast.service';

const TYPE_CLASSES: Record<ToastType, string> = {
  error: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-green-200 bg-green-50 text-green-800',
  info: 'border-indigo-200 bg-indigo-50 text-indigo-800',
};

/** Contenitore dei toast: va inserito una sola volta, nella shell dell'app. */
@Component({
  selector: 'app-toast',
  host: { class: 'pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2' },
  template: `
    @for (toast of toastService.toasts(); track toast.id) {
      <div
        role="alert"
        class="pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg"
        [class]="typeClasses[toast.type]"
      >
        <span class="flex-1">{{ toast.message }}</span>
        <button
          type="button"
          aria-label="Chiudi"
          (click)="toastService.dismiss(toast.id)"
          class="font-bold leading-none opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    }
  `,
})
export class Toast {
  protected readonly toastService = inject(ToastService);
  protected readonly typeClasses = TYPE_CLASSES;
}
