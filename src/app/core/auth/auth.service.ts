import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { delay, map, Observable, of, tap, throwError } from 'rxjs';

export interface AuthUser {
  email: string;
  name: string;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

/** Errore restituito dalla finta API, con lo stato HTTP simulato. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const STORAGE_KEY = 'auth.session';

/** Utente accettato dalla finta API (solo per demo). */
const DEMO_USER = { email: 'demo@example.com', password: 'password1', name: 'Utente Demo' };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _router = inject(Router);

  private readonly _user = signal<AuthUser | null>(this._readSession());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  /** Finto `POST /api/login`: a successo salva la sessione, altrimenti emette un `ApiError`. */
  login(email: string, password: string): Observable<AuthUser> {
    return this._fakeLoginApi(email, password).pipe(
      tap((response) => {
        this._writeSession(response);
        this._user.set(response.user);
      }),
      // il token resta interno al service, fuori esce solo l'utente
      map((response) => response.user),
    );
  }

  logout(): void {
    this._user.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // storage non disponibile: la sessione in memoria è già azzerata
    }
    this._router.navigate(['/login']);
  }

  /** Simula la risposta del server: latenza di rete, poi 200 con token oppure 401. */
  private _fakeLoginApi(email: string, password: string): Observable<LoginResponse> {
    if (email.trim().toLowerCase() === DEMO_USER.email && password === DEMO_USER.password) {
      return of<LoginResponse>({
        token: 'fake-jwt-token',
        user: { email: DEMO_USER.email, name: DEMO_USER.name },
      }).pipe(delay(800));
    }
    return throwError(() => new ApiError(401, 'Credenziali non valide')).pipe(delay(800));
  }

  private _readSession(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as LoginResponse).user : null;
    } catch {
      return null;
    }
  }

  private _writeSession(response: LoginResponse): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
    } catch {
      // storage non disponibile: la sessione resta solo in memoria
    }
  }
}
