import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import {
  passwordMatch,
  passwordRequirementState,
  passwordStrength,
} from './password.validator';

describe('passwordRequirementState', () => {
  it('riconosce una password valida', () => {
    expect(passwordRequirementState('Abcdef1!')).toEqual({
      length: true,
      upper: true,
      lower: true,
      digit: true,
      special: true,
    });
  });

  it('gestisce null e undefined come stringa vuota', () => {
    const allFalse = { length: false, upper: false, lower: false, digit: false, special: false };
    expect(passwordRequirementState(null)).toEqual(allFalse);
    expect(passwordRequirementState(undefined)).toEqual(allFalse);
  });

  it('controlla i limiti di lunghezza (8-100)', () => {
    expect(passwordRequirementState('a'.repeat(7)).length).toBe(false);
    expect(passwordRequirementState('a'.repeat(8)).length).toBe(true);
    expect(passwordRequirementState('a'.repeat(100)).length).toBe(true);
    expect(passwordRequirementState('a'.repeat(101)).length).toBe(false);
  });

  it('segnala il singolo requisito mancante', () => {
    expect(passwordRequirementState('abcdefg1!').upper).toBe(false);
    expect(passwordRequirementState('ABCDEFG1!').lower).toBe(false);
    expect(passwordRequirementState('Abcdefgh!').digit).toBe(false);
    expect(passwordRequirementState('Abcdefg1').special).toBe(false);
  });
});

describe('passwordStrength / passwordMatch (Signal Forms)', () => {
  function createForm(initial = { password: '', confirm: '' }) {
    return TestBed.runInInjectionContext(() =>
      form(signal(initial), (p) => {
        passwordStrength(p.password);
        passwordMatch(p.confirm, p.password);
      }),
    );
  }

  const kinds = (errors: readonly { kind: string }[]) => errors.map((e) => e.kind);

  it('un campo vuoto non genera errori (ci pensa required)', () => {
    expect(createForm().password().errors()).toEqual([]);
  });

  it('elenca un errore per ogni requisito mancante', () => {
    const f = createForm({ password: 'abc', confirm: '' });
    expect(kinds(f.password().errors())).toEqual([
      'passwordLength',
      'passwordUpper',
      'passwordDigit',
      'passwordSpecial',
    ]);
    expect(f.password().invalid()).toBe(true);
  });

  it('accetta una password che rispetta tutti i requisiti', () => {
    const f = createForm({ password: 'Abcdef1!', confirm: 'Abcdef1!' });
    expect(f.password().errors()).toEqual([]);
    expect(f.password().valid()).toBe(true);
  });

  it('si riesegue quando cambia il valore', () => {
    const f = createForm({ password: 'abc', confirm: '' });
    expect(f.password().invalid()).toBe(true);
    f.password().value.set('Abcdef1!');
    expect(f.password().valid()).toBe(true);
  });

  it('passwordMatch segnala password diverse e passa se coincidono', () => {
    const f = createForm({ password: 'Abcdef1!', confirm: 'Altra1!x' });
    expect(kinds(f.confirm().errors())).toEqual(['passwordMismatch']);
    f.confirm().value.set('Abcdef1!');
    expect(f.confirm().errors()).toEqual([]);
  });

  it('passwordMatch si riesegue quando cambia il campo password', () => {
    const f = createForm({ password: 'Abcdef1!', confirm: 'Abcdef1!' });
    expect(f.confirm().valid()).toBe(true);
    f.password().value.set('Diversa1!');
    expect(kinds(f.confirm().errors())).toEqual(['passwordMismatch']);
  });
});
