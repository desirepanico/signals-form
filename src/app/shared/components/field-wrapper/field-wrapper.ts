import { Component, computed, input } from '@angular/core';
import type { ValidationError } from '@angular/forms/signals';
import { translate } from '../../i18n/translate';
import { ErrorMessage } from '../error-message/error-message';

@Component({
  selector: 'app-field-wrapper',
  imports: [ErrorMessage],
  templateUrl: './field-wrapper.html',
  host: { class: 'block' },
})
export class FieldWrapper {
  readonly label = input.required<string>();
  readonly disabled = input(false);
  /** Errori del campo, mostrati da `<app-error-message>`. */
  readonly errors = input<readonly ValidationError[]>([]);

  /** Label tradotta: `label` è una chiave di it.json. */
  protected readonly translatedLabel = computed(() => translate(this.label()));

  /** Label con la prima lettera minuscola, per l'uso dentro le frasi di errore. */
  protected readonly fieldName = computed(() => {
    const label = this.translatedLabel();
    return label.charAt(0).toLowerCase() + label.slice(1);
  });
}
