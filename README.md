# SignalsForm

Applicazione Angular 22 con **Signal Forms** (`@angular/forms/signals`) e Tailwind CSS 4. Progetto generato con [Angular CLI](https://github.com/angular/angular-cli) 22.0.5.

## Comandi

```bash
npm start        # server di sviluppo su http://localhost:4200/
npm run build    # build di produzione in dist/
npm test         # test con Vitest
```

## Struttura

```text
src/app/
  core/auth/                 AuthService e auth.guard
  pages/                     login, register, home (ts + html)
  shared/
    components/              controlli riusabili dei form
      input/                 input-text, input-password, input-checkbox
      field-wrapper/         label + controllo + errori
      error-message/         primo errore, tradotto
      toast/                 messaggi a comparsa
    validators/              validatori custom (+ .spec.ts)
    services/                ToastService
    i18n/                    translate() e caricamento traduzioni
public/i18n/it.json          tutti i testi di label, errori e toast
.claude/rules/               regole del progetto per Claude Code
```

## Convenzioni

- Componenti standalone, template in file `.html`, stato con signals, control flow nativo (`@if`, `@for`).
- Stile solo Tailwind, classi condizionali come stringhe complete in `[class]`.
- Nessun testo scritto nel codice per label ed errori: tutto in `public/i18n/it.json`.
- Ogni validatore custom ha il suo `.spec.ts`.

## Signal Forms

Il progetto usa solo Signal Forms: mai `FormGroup`, `FormControl` o `ngModel`. Un form è fatto di un modello (`signal`), regole (funzione schema di `form()`) e template (`[formRoot]` + `[field]`).

- **Guida passo per passo:** [docs/progetto-e-signal-forms.md](docs/progetto-e-signal-forms.md).
- **Regole per il codice:** `.claude/rules/signal-forms.md` (form) e `.claude/rules/shared-inputs.md` (controlli e traduzioni).
- **Esempi:** `pages/login` (submit su API) e `pages/register` (tutte le regole).

## Risorse

- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
