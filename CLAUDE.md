# signals-form

Applicazione Angular 22 con Signal Forms e Tailwind CSS 4.

## Comandi

- `npm start`: avvia il server di sviluppo
- `npm run build`: build di produzione
- `npm test`: test con Vitest

## Riferimenti

- Regole di dettaglio in `.claude/rules/`: `angular`, `structure`, `styling`, `signal-forms` (regole, submit, validatori), `form-components` (componenti, traduzioni, toast).
- Form: logica (modello, schema, submit, validatori) in `signal-forms`; aspetto e testi (componenti, `it.json`, toast) in `form-components`. Un validatore custom richiede entrambe.
- Esempi reali: `src/app/pages/login/login.ts` (submit su API), `src/app/pages/register/register.ts` (tutte le regole).
