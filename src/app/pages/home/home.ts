import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  template: `
    <main class="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <section class="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1 class="text-2xl font-semibold text-slate-900">Ciao, {{ auth.user()?.name }}</h1>
        <p class="text-sm text-slate-500">{{ auth.user()?.email }}</p>
        <button
          type="button"
          (click)="auth.logout()"
          class="w-full rounded-lg bg-slate-800 px-4 py-2 font-medium text-white transition hover:bg-slate-900"
        >
          Esci
        </button>
      </section>
    </main>
  `,
})
export class Home {
  protected readonly auth = inject(AuthService);
}
