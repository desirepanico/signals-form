# Componenti dei form e traduzioni

Riferimento generale: `docs/guida-signal-forms.md`. Regole di validazione e submit: `signal-forms.md`.

## Componenti shared

Tutti standalone, in `src/app/shared/components/<nome>/`.

| Componente                                      | Ruolo                                                                                                                                                   |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input/input-text` (`<app-input-text>`)         | input `text`, `email`, `password`, `tel`, `url`, `number`, `date`. Input: `label`, `type`, `field`. Gestisce bordo rosso su errore e stato disabilitato |
| `input/input-checkbox` (`<app-input-checkbox>`) | casella `boolean`                                                                                                                                       |
| `field-wrapper` (`<app-field-wrapper>`)         | label (tradotta) + `<ng-content />` + errori. Input: `label`, `disabled`, `errors`                                                                      |
| `error-message` (`<app-error-message>`)         | mostra il primo errore tradotto in base al `kind`                                                                                                       |
| `toast` (`<app-toast>`)                         | contenitore dei toast, **una sola volta** in `app.ts`                                                                                                   |

- Ogni nuovo tipo di controllo avvolge il suo `<input>` in `<app-field-wrapper>`: label, errori e disabilitato restano coerenti.
- Il controllo riceve il `FieldTree` come `[field]` e lega `[formField]="field()"`. Non contiene regole di validazione: mostra solo `invalid()` ed `errors()`.
- `type` di `input-text` va scritto come attributo fisso nel template (`@switch`), perché `FormField` deve conoscere il tipo nativo (number/date) all'inizializzazione.
- Un `FieldTree` di tipo diverso da `string` si passa con i cast `asNumber`/`asDate` già presenti in `input-text`.
- Classi Tailwind condizionali: vedi `styling.md`.

## Traduzioni (`public/i18n/it.json`)

- Nessun testo scritto nel codice per label ed errori: tutto in `public/i18n/it.json`, letto da `translate(chiave, params)` (`shared/i18n/translate.ts`). Il file è caricato all'avvio da `loadTranslations()` (`provideAppInitializer` in `app.config.ts`).
- **Label**: `label="registration.fields.email"` è una chiave; il wrapper la traduce. Chiave mancante → `translate` restituisce la chiave (si nota subito a schermo).
- **Errori di validazione**: `common.validation.<kind>`, con `{{field}}` = nome della label **tradotta con la prima lettera minuscola** e gli altri parametri presi dall'errore (`{{minLength}}`, `{{min}}`…). Se manca la voce si usa `common.validation.generic`.
  Esempio: `"required": "Il campo {{field}} è richiesto"`.
- Nuovo `kind` custom → aggiungere subito la voce in `common.validation`.
- Messaggi di API/toast: sezione dedicata (es. `login.errors.invalidCredentials`).
- Nuova lingua: nuovo file `public/i18n/<lang>.json` e `loadTranslations('<lang>')`.
