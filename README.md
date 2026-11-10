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
| `.claude/rules/` | regole di dettaglio per Claude Code (angular, shared-inputs, signal-forms, structure, styling) |

## Come funzionano i Signal Forms

Il progetto usa solo Signal Forms (`@angular/forms/signals`): mai `FormGroup`, `FormControl` o `ngModel`. Un form ha tre parti separate:

1. **Modello:** un `signal` tipizzato con i soli dati, con valori iniziali sempre definiti (`''`, `null`, `false`, `[]`).
2. **Regole:** una funzione schema, secondo argomento di `form()`. Le regole di validazione stanno solo qui, mai nel template.
3. **Template:** `[formRoot]` sul `<form>` e `[field]` sui controlli (`app-input-text`, `app-input-checkbox`).

```ts
model = signal<LoginModel>({ email: '', password: '' });

form = form(
  this.model,
  (p) => {
    required(p.email);
    email(p.email);
    required(p.password);
    minLength(p.password, 8);
  },
  { submission: { action: (field) => /* Promise */ } },
);
```

```html
<form [formRoot]="form">
  <app-input-text label="login.fields.email" type="email" [field]="form.email" />
  <button type="submit" [disabled]="form().invalid() || form().submitting()">Accedi</button>
</form>
```

- **Invio:** `[formRoot]` esegue `submission.action` solo se il form è valido. L'azione restituisce una `Promise`: finché è pendente `form().submitting()` è `true`.
- **Errori:** una regola restituisce solo un `kind`; il testo viene da `common.validation.<kind>` in `public/i18n/it.json` e si mostra solo con campo toccato e non valido.
- **Esempi:** `pages/login` (submit su API) e `pages/register` (tutte le regole).
- **Regole complete** (validazione, stato, validatori custom, componenti): `.claude/rules/signal-forms.md` e `.claude/rules/shared-inputs.md`.

## Convenzioni

- Componenti standalone, template in file `.html`, stato con signals, control flow nativo (`@if`, `@for`).
- Stile solo Tailwind, classi condizionali come stringhe complete in `[class]`.
- Nessun testo scritto nel codice per label ed errori: tutto in `public/i18n/it.json`.
- Ogni validatore custom ha il suo `.spec.ts`.

## Risorse

- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
