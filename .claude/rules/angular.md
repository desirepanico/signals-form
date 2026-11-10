# Angular

- Angular 22, componenti standalone, template in file `.html` separato.
- Stato con signals (`signal`, `computed`, `input`); niente `@Input()` a decoratore.
- Control flow nativo (`@if`, `@for`), non `*ngIf`/`*ngFor`.
- Dipendenze con `inject()`, non nel costruttore; membri privati con prefisso `_` (`_authService`, `_destroyRef`).
- Subscribe RxJS sempre con `takeUntilDestroyed(this._destroyRef)`.
- Form: vedi `signal-forms.md` e `form-components.md`.
