# signals-form

Applicazione Angular 22 con Signal Forms e Tailwind CSS 4.

## Comandi

- `npm start`: avvia il server di sviluppo
- `npm run build`: build di produzione
- `npm test`: test con Vitest

## Riferimenti

- Regole di dettaglio in `.claude/rules/`: `angular`, `structure`, `styling`, `signal-forms` (regole, submit, validatori), `shared-inputs` (controlli in shared, traduzioni, toast).
- Form: logica (modello, schema, submit, validatori) in `signal-forms`; controlli condivisi e testi (componenti, `it.json`, toast) in `shared-inputs`. Un validatore custom richiede entrambe.
- Esempi reali: `src/app/pages/login/login.ts` (submit su API), `src/app/pages/register/register.ts` (tutte le regole).
