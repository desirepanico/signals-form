import { Component, computed, input, signal } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { translate } from '../../i18n/translate';
import { FieldWrapper } from '../field-wrapper/field-wrapper';

@Component({
  selector: 'app-input-password',
  imports: [FormField, FieldWrapper],
  templateUrl: './input-password.html',
  host: { class: 'block' },
})
export class InputPassword {
  readonly label = input.required<string>();
  readonly field = input.required<FieldTree<string>>();
  readonly autocomplete = input<'current-password' | 'new-password'>('current-password');

  /** `true` = password in chiaro. Solo stato di UI: non fa parte del modello del form. */
  protected readonly visible = signal(false);

  protected readonly toggleLabel = computed(() =>
    translate(this.visible() ? 'common.password.hide' : 'common.password.show'),
  );

  protected readonly hasError = computed(() => {
    const state = this.field()();
    return state.touched() && state.invalid();
  });

  protected readonly inputClass = computed(() =>
    this.hasError()
      ? 'mt-1 block w-full rounded-lg border border-red-500 py-2 pl-3 pr-10 text-slate-900 shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400'
      : 'mt-1 block w-full rounded-lg border border-slate-300 py-2 pl-3 pr-10 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
  );

  protected toggle(): void {
    this.visible.update((v) => !v);
  }
}
