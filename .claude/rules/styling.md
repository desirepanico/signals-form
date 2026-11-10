# Stile

- Solo Tailwind CSS 4 (`@import 'tailwindcss'` in `src/styles.css`); evitare CSS custom.
- Le classi condizionali si scrivono come stringhe complete in un ternario in `[class]`, mai concatenate, così Tailwind le rileva.
- Non mischiare classi in conflitto (es. `border-slate-300` e `border-red-500`): scegliere un solo set.
