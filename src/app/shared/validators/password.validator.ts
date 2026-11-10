import { SchemaPath, validate } from '@angular/forms/signals';

export interface PasswordRequirementState {
  length: boolean;
  upper: boolean;
  lower: boolean;
  digit: boolean;
  special: boolean;
}

/** Qualsiasi carattere che non sia lettera, cifra o spazio. */
export const PASSWORD_SPECIAL_CHAR = /[^A-Za-z0-9\s]/;

/** Funzione pura: dice quali requisiti la password soddisfa (riusabile anche per una checklist in UI). */
export function passwordRequirementState(value: string | null | undefined): PasswordRequirementState {
  const p = value ?? '';
  return {
    length: p.length >= 8 && p.length <= 100,
    upper: /[A-Z]/.test(p),
    lower: /[a-z]/.test(p),
    digit: /[0-9]/.test(p),
    special: PASSWORD_SPECIAL_CHAR.test(p),
  };
}

/**
 * Regola Signal Forms: una password deve rispettare tutti i requisiti.
 * Restituisce un errore per ogni requisito mancante, con `kind` = `password<Requisito>`
 * (es. `passwordUpper`); il testo sta in `common.validation.<kind>` di it.json.
 * Un campo vuoto non genera errori: ci pensa `required()`.
 */
export function passwordStrength(path: SchemaPath<string>): void {
  validate(path, ({ value }) => {
    if (!value()) return null;
    const state = passwordRequirementState(value());
    const missing = (Object.keys(state) as (keyof PasswordRequirementState)[]).filter(
      (requirement) => !state[requirement],
    );
    return missing.length
      ? missing.map((requirement) => ({
          kind: `password${requirement.charAt(0).toUpperCase()}${requirement.slice(1)}`,
        }))
      : null;
  });
}

/** Regola Signal Forms: il campo deve coincidere con il campo password (`kind`: `passwordMismatch`). */
export function passwordMatch(path: SchemaPath<string>, passwordPath: SchemaPath<string>): void {
  validate(path, ({ value, valueOf }) =>
    value() === valueOf(passwordPath) ? null : { kind: 'passwordMismatch' },
  );
}
