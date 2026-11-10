import { signal } from '@angular/core';

type Params = Record<string, unknown>;

const translations = signal<Record<string, unknown>>({});

/** Carica `public/i18n/<lang>.json`; chiamata all'avvio dell'app (vedi app.config.ts). */
export async function loadTranslations(lang = 'it'): Promise<void> {
  const response = await fetch(`i18n/${lang}.json`);
  translations.set(await response.json());
}

/** Risolve una chiave puntata (es. `common.validation.required`) e sostituisce `{{param}}`. */
export function translate(key: string, params: Params = {}): string {
  const text = key
    .split('.')
    .reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], translations());
  if (typeof text !== 'string') return key;
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name) => String(params[name] ?? ''));
}
