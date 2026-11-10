import { SchemaPath, validate } from '@angular/forms/signals';

/** Regola Signal Forms: l'URL deve iniziare con https:// (campo vuoto ammesso, `kind`: `https`). */
export function https(path: SchemaPath<string>): void {
  validate(path, ({ value }) =>
    !value() || value().startsWith('https://') ? null : { kind: 'https' },
  );
}
