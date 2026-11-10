import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import {
  apply,
  email,
  form,
  FormRoot,
  minLength,
  required,
  schema,
  TreeValidationResult,
} from '@angular/forms/signals';
import { ApiError, AuthService } from '../../core/auth/auth.service';
import { InputText } from '../../shared/components/input/input-text';
import { ToastService } from '../../shared/services/toast.service';

interface LoginModel {
  email: string;
  password: string;
}

const emailFieldSchema = schema<string>((path) => {
  required(path);
  email(path);
});

@Component({
  selector: 'app-login',
  imports: [FormRoot, InputText, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _toastService = inject(ToastService);
  private readonly _destroyRef = inject(DestroyRef);

  model = signal<LoginModel>({ email: '', password: '' });

  form = form(
    this.model,
    (p) => {
      apply(p.email, emailFieldSchema);
      required(p.password);
      minLength(p.password, 8);
    },
    {
      // Eseguita da [formRoot] solo se il form è valido. La Promise si risolve a
      // fine chiamata: finché è pendente `form().submitting()` è true.
      submission: {
        action: (field) =>
          new Promise<TreeValidationResult>((resolve) => {
            const { email, password } = field().value();
            this._authService
              .login(email, password)
              .pipe(takeUntilDestroyed(this._destroyRef))
              .subscribe({
                next: () => {
                  this._onLoginSuccess();
                  resolve(undefined);
                },
                error: (error: unknown) => {
                  this._onLoginError(error);
                  resolve(undefined);
                },
              });
          }),
      },
    },
  );

  private _onLoginSuccess(): void {
    this._router.navigate(['/home']);
  }

  /** Mostra l'errore della API in un toast: non è un errore di un campo. */
  private _onLoginError(error: unknown): void {
    const key =
      error instanceof ApiError && error.status === 401
        ? 'login.errors.invalidCredentials'
        : 'login.errors.serverError';
    this._toastService.error(key);
  }
}
