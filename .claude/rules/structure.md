# Struttura

- Componenti riusabili in `src/app/shared/components/<nome>/` (ts + html), mai dentro `app.ts`.
- Selettore con prefisso `app-`; file e classe in kebab-case / PascalCase (`input-text.ts` → `InputText`).
- Pagine in `src/app/pages/<nome>/`, autenticazione in `src/app/core/auth/`, servizi condivisi in `src/app/shared/services/`.
- Validatori custom e traduzioni: percorsi in `signal-forms.md` e `form-components.md`.
