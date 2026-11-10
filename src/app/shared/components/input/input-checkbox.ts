import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { translate } from '../../i18n/translate';

@Component({
  selector: 'app-input-checkbox',
  imports: [FormField],
  host: { class: 'block' },
  template: `
    <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
      <input
        type="checkbox"
        [formField]="field()"
        class="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:cursor-not-allowed"
      />
      {{ t(label()) }}
    </label>
  `,
})
export class InputCheckbox {
  readonly label = input.required<string>();
  readonly field = input.required<FieldTree<boolean>>();
  protected readonly t = translate;
}
