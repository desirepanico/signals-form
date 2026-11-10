# Signal Forms

Solo Signal Forms (`@angular/forms/signals`, Angular 22). Mai `FormGroup`/`FormControl`/`ngModel`.

Questa rule riguarda la **logica** del form (modello, schema, submit, stato, validatori). Componenti dei controlli, label, errori tradotti e toast: `form-components.md`. Esempi reali: `pages/login/login.ts` (submit su API), `pages/register/register.ts` (tutte le regole).

Nuovo form, in ordine: modello con valori iniziali definiti → regole nello schema → template con `[formRoot]` e `[field]` → label ed errori in `it.json` → validatori custom in `shared/validators` con `.spec.ts`.

## Struttura di un form

- Il **modello** è un `signal<Interface>()` tipizzato: contiene solo i dati. Ogni campo che l'utente compila parte con un valore definito (`''`, `null`, `false`, `[]`): per i Signal Forms `undefined` significa «il campo non esiste», quindi non viene creato il suo `FieldTree` e non si può legare a un input. `undefined` è ammesso solo per campi **opzionali che possono mancare del tutto** (`campo?: string`), e nel template vanno protetti prima dell'uso. Per «nessun valore» in un input usare `null` o `''`.
- Le **regole** stanno tutte nella funzione schema, secondo argomento di `form(model, schemaFn, options)`. Gira una sola volta; riceve i percorsi dei campi (`p.email`), non i campi.
- Il **template** usa `[formRoot]="form"` sul `<form>` e `[formField]="form.campo"` su ogni input. Entrambe le direttive vanno in `imports` (`FormRoot`, `FormField`; nei componenti shared basta `FormField`).
- Si leggono i dati con `form().value()`, lo stato di un campo con `form.campo()` (es. `form.email().touched()`).

```ts
model = signal<LoginModel>({ email: '', password: '' });

form = form(
  this.model,
  (p) => {
    apply(p.email, emailFieldSchema);
    required(p.password);
    minLength(p.password, 8);
  },
  { submission: { action: (field) => /* Promise */ } },
);
```

```html
<form [formRoot]="form">
  <app-input-text label="login.fields.email" [field]="form.email" />
  <button type="submit" [disabled]="form().invalid() || form().submitting()">Accedi</button>
</form>
```

## Invio (submit)

- L'azione sta in `form(..., { submission: { action } })`. `[formRoot]` la esegue **solo se il form è valido** e aggiunge `novalidate` da solo. Niente `(submit)` e niente `submit()` a mano.
- `action` deve restituire una **`Promise<TreeValidationResult>`**: finché è pendente `form().submitting()` è `true` (usarlo per disabilitare il bottone e cambiare il testo).
- Con le chiamate RxJS (`takeUntilDestroyed` come in `angular.md`): `subscribe({ next, error, complete })` dentro una `new Promise` risolta in `next`, `error` e `complete` (quest'ultimo evita una Promise pendente se il componente è distrutto a metà chiamata).
- Nell'`action` non dare a una variabile il nome di una regola importata (es. `const { email } = ...` oscura `email()`): usare `const credentials = field().value()`.
- Gli errori delle API si mostrano in un toast (vedi `form-components.md`), non come errore di campo: l'`action` risolve comunque con `undefined`.

## Regole di validazione

Si dichiarano nello schema, mai nel template e mai nei componenti dei controlli. Le regole sono indipendenti: la validazione non si ferma al primo errore. **Non passare `message`**: il testo viene da `it.json` in base al `kind` (vedi `form-components.md`).

| Regola                         | Uso                                                                                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `required`, `email`, `pattern` | testo; `required` considera vuoti `null`, `undefined`, `''`, `false`, `NaN` (`0` e `[]` sono presenti: per gli array `minLength`)                             |
| `minLength`, `maxLength`       | stringhe (caratteri) e array (elementi)                                                                                                                       |
| `min`, `max`                   | numeri                                                                                                                                                        |
| `minDate`, `maxDate`           | `Date` da `<input type="date">`: limiti **sempre in UTC** (`new Date('AAAA-MM-GG')` o `Date.UTC`), mai `new Date(anno, mese, giorno)` né `new Date()` diretto |
| `validate`                     | regola custom su un campo: restituisce `{ kind }` oppure `null`                                                                                               |
| `validateTree`                 | regola su un gruppo di campi, con `fieldTree` del campo a cui attaccare l'errore                                                                              |
| `validateHttp`                 | regola asincrona, parte solo dopo le sincrone; mentre attende `pending()` è `true`                                                                            |

- **Regole custom**: `{ kind: 'nomeErrore' }` e la voce `common.validation.nomeErrore` in `it.json`. Se riusabili, si incapsulano in una funzione che prende `SchemaPath<T>` (es. `https(path)`).
- **Tra più campi**: `valueOf(p.altroCampo)` dentro `validate`; la regola si riesegue al cambio di uno dei campi.
- **Condizionale su una regola**: `required(p.x, { when: ({ valueOf }) => valueOf(p.flag) })`.

## Schemi

- **`schema<T>(fn)` + `apply(path, schema)`**: schema riusabile (es. `emailFieldSchema`). Chi lo applica può aggiungere altre regole allo stesso campo.
- **`applyEach(p.items, itemSchema)`**: stesse regole su ogni elemento di un array. Nel template `@for (item of form.items; track $index)` e `[field]="item.name"`; si aggiunge/toglie con `model.update(...)`.
- **`applyWhen(path, cond, schema)`**: i campi esistono sempre, la regola si accende solo se `cond` è vera (es. «codice promo» solo con lo sconto).
- **`applyWhenValue(path, typeGuard, schema)`**: il modello è un'**unione di varianti** (`Privato | Azienda`) e i campi cambiano con la variante. Il type guard (`(c): c is Azienda => c.type === 'company'`) restringe il tipo.
- Test rapido: se la condizione è falsa i campi esistono ancora nel modello? Sì → `applyWhen`; no → `applyWhenValue`.
- Un'unione espone solo le chiavi comuni (`type`): per il template si fa un cast al tipo della variante (`form.customer as unknown as FieldTree<Azienda>`) e si mostra il campo con `@if (customerType() === 'company')`. Per cambiare variante si sostituisce l'intero oggetto nel modello.

## Stato dei campi

Si leggono come signal da `form.campo()`:

| Signal                    | Significato                                                    |
| ------------------------- | -------------------------------------------------------------- |
| `valid()` / `invalid()`   | esito (`valid()` è `false` mentre una regola async è in corso) |
| `errors()`                | array di errori `{ kind, ... }`                                |
| `pending()`               | regola asincrona in corso                                      |
| `touched()` / `dirty()`   | campo toccato / valore modificato                              |
| `disabled()` / `hidden()` | disabilitato / nascosto                                        |
| `submitting()`            | (solo sul form) invio in corso                                 |

- Gli errori si mostrano **solo con `touched() && invalid()`**, per non mostrarli prima che l'utente interagisca (lo fa già `app-input-text`).
- Non usare `:valid`/`:invalid`, `validity`, `validationMessage` del browser: per lo stile si legano le classi ai signal di stato.

## Stato disabilitato

Si dichiara **nello schema**, non con l'attributo `disabled` del template:

```ts
disabled(p.username); // sempre disabilitato
disabled(p.username, { when: () => 'Non modificabile' }); // con motivo (stringa)
disabled(p.promoCode, { when: ({ valueOf }) => !valueOf(p.applyDiscount) }); // condizionale
```

- La forma `disabled(path, () => ...)` (funzione diretta) è **deprecata**: usare `{ when }`.
- `when` può restituire `true`, `false` o una **stringa col motivo** (leggibile da `form.campo().disabledReasons()`).
- Un campo disabilitato **non contribuisce a validazione, touched/dirty** né allo stato del genitore, quindi non rende il form invalido. Il suo valore resta però nel payload di `form().value()`.
- `[formField]` imposta da solo l'attributo `disabled` sull'input nativo: nei componenti basta leggere `field()().disabled()` per lo stile (grigio, cursore `not-allowed`, label schiarita).
- Per nascondere un campo usare `hidden(path, { when })` e proteggerlo nel template con `@if (!form.campo().hidden())`. Per sola lettura `readonly(path, ...)`.

## Validatori personalizzati

- Stanno in `src/app/shared/validators/<nome>.validator.ts`, raggruppati per tema (`password.validator.ts`, `url.validator.ts`), mai dentro i componenti.
- Due livelli, nello stesso file:
  1. **Funzione pura** sul valore (`passwordRequirementState(value)`): testabile senza Angular e riusabile anche in UI (es. checklist dei requisiti).
  2. **Regola Signal Forms** che la usa: funzione che prende `SchemaPath<T>` e chiama `validate()` (`passwordStrength(path)`, `https(path)`).
- La regola restituisce `{ kind: 'nomeErrore' }` oppure `null`; per più requisiti mancanti restituisce un **array** di errori (uno per `kind`). Niente `message`: ogni `kind` ha la sua voce in `common.validation` di `it.json`.
- Un campo vuoto non è un errore del validatore custom (`if (!value()) return null`): ci pensa `required()`.
- Regola tra più campi: prende un secondo `SchemaPath` e usa `valueOf()` (`passwordMatch(p.confirm, p.password)`).
- Si usano nello schema come le built-in: `required(p.password); passwordStrength(p.password);`.

```ts
// shared/validators/url.validator.ts
export function https(path: SchemaPath<string>): void {
  validate(path, ({ value }) =>
    !value() || value().startsWith('https://') ? null : { kind: 'https' },
  );
}
```

### Test dei validatori

Ogni `*.validator.ts` ha il suo `*.validator.spec.ts` accanto (`npm test`, Vitest). Le regole Signal Forms si provano creando un `form()` in contesto di iniezione e leggendo `errors()`:

```ts
const f = TestBed.runInInjectionContext(() =>
  form(signal({ website: 'http://x.it' }), (p) => {
    https(p.website);
  }),
);
expect(
  f
    .website()
    .errors()
    .map((e) => e.kind),
).toEqual(['https']);
f.website().value.set('https://x.it'); // la regola si riesegue
expect(f.website().valid()).toBe(true);
```

Casi da coprire: valore valido, campo vuoto, ogni requisito mancante, limiti (es. 7/8/100/101 caratteri), riesecuzione al cambio di valore (e del campo collegato per le regole tra campi).
