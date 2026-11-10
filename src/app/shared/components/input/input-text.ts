import { Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { FieldWrapper } from '../field-wrapper/field-wrapper';

@Component({
  selector: 'app-input-text',
  imports: [FormField, FieldWrapper],
  templateUrl: './input-text.html',
  host: { class: 'block' },
})
export class InputText {
  readonly label = input.required<string>();
  readonly type = input<'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'date'>('text');
  readonly field = input.required<FieldTree<string> | FieldTree<number | null> | FieldTree<Date | null>>();

  // Il tipo del campo dipende da `type`: i cast servono solo al type-check del template.
  protected readonly asString = computed(() => this.field() as FieldTree<string>);
  protected readonly asNumber = computed(() => this.field() as FieldTree<number | null>);
  protected readonly asDate = computed(() => this.field() as FieldTree<Date | null>);

  protected readonly hasError = computed(() => {
    const state = this.field()();
    return state.touched() && state.invalid();
  });

  protected readonly inputClass = computed(
    () =>
      this.hasError()
        ? 'mt-1 block w-full rounded-lg border border-red-500 px-3 py-2 text-slate-900 shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400'
        : 'mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
  );
}
