# SignalsForm

Applicazione Angular 22 con **Signal Forms** (`@angular/forms/signals`) e Tailwind CSS 4. Progetto generato con [Angular CLI](https://github.com/angular/angular-cli) 22.0.5.

## Comandi

```bash
npm start        # server di sviluppo su http://localhost:4200/
npm run build    # build di produzione in dist/
npm test         # test con Vitest
```

## Struttura

| Percorso | Contenuto |
| --- | --- |
| `src/app/pages/` | pagine: `login` (form semplice con submit su API), `register` (tutte le regole), `home` |
| `src/app/core/auth/` | `AuthService` e `auth.guard` |
| `src/app/shared/components/` | componenti riusabili: `input-text`, `input-checkbox`, `field-wrapper`, `error-message`, `toast` |
| `src/app/shared/validators/` | validatori custom (`password`, `url`) con i relativi `.spec.ts` |
| `src/app/shared/i18n/` | `translate()` e caricamento traduzioni |
| `public/i18n/it.json` | tutti i testi di label, errori e toast |
| `docs/` | documentazione |
| `.claude/rules/` | regole di dettaglio per Claude Code (angular, form-components, signal-forms, structure, styling) |

## Signal Forms

Il progetto usa solo Signal Forms: mai `FormGroup`, `FormControl` o `ngModel`. Un form è fatto di modello (`signal`), regole (funzione schema di `form()`) e template (`[formRoot]` + `[formField]`); l'invio è `submission.action` e restituisce una `Promise`.

Guida completa: [docs/guida-signal-forms.md](docs/guida-signal-forms.md).

## Convenzioni

- Componenti standalone, template in file `.html`, stato con signals, control flow nativo (`@if`, `@for`).
- Stile solo Tailwind, classi condizionali come stringhe complete in `[class]`.
- Nessun testo scritto nel codice per label ed errori: tutto in `public/i18n/it.json`.
- Ogni validatore custom ha il suo `.spec.ts`.

## Risorse

- [Guida ai Signal Forms del progetto](docs/guida-signal-forms.md)
- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
