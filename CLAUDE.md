# signals-form

Applicazione Angular 22 con Signal Forms e Tailwind CSS 4.

## Comandi

- `npm start`: avvia il server di sviluppo
- `npm run build`: build di produzione
- `npm test`: test con Vitest

## Struttura

- Componenti riusabili in `src/app/shared/components/<nome>/` (esempio: `input/input-text`).
- Regole di dettaglio in `.claude/rules/` (angular, styling, structure).

## Convenzioni

- Form con `@angular/forms/signals`; submit in `form(..., { submission: { action } })` con `[formRoot]`.
- Stile solo Tailwind, classi condizionali come stringhe complete in `[class]`.
