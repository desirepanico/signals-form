import { Component, computed, input } from '@angular/core';
import type { ValidationError } from '@angular/forms/signals';
import { translate } from '../../i18n/translate';

/** Mostra il primo errore di un campo, tradotto da it.json in base al `kind`. */
@Component({
  selector: 'app-error-message',
  host: { class: 'block text-sm text-red-600', role: 'alert' },
  template: `{{ message() }}`,
})
export class ErrorMessage {
  /** Errori del campo (di solito `field().errors()`). */
  readonly errors = input<readonly ValidationError[]>([]);
  /** Nome del campo da inserire nella frase (`{{field}}`). */
  readonly field = input('');

  readonly message = computed(() => {
    const [error] = this.errors();
    if (!error) return '';
    const field = this.field();
    const known = translate(`common.validation.${error.kind}`, { ...error, field });
    return known.startsWith('common.validation.')
      ? translate('common.validation.generic', { field })
      : known;
  });
}
