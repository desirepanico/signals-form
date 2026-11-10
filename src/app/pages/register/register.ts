import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  apply,
  applyEach,
  applyWhen,
  applyWhenValue,
  disabled,
  email,
  FieldTree,
  form,
  FormRoot,
  hidden,
  max,
  maxDate,
  min,
  minDate,
  minLength,
  pattern,
  required,
  schema,
} from '@angular/forms/signals';
import { InputCheckbox } from '../../shared/components/input/input-checkbox';
import { InputPassword } from '../../shared/components/input/input-password';
import { InputText } from '../../shared/components/input/input-text';
import { passwordMatch, passwordStrength } from '../../shared/validators/password.validator';
import { https } from '../../shared/validators/url.validator';

interface Item {
  name: string;
  quantity: number | null;
}

interface PrivateCustomer {
  type: 'private';
  fiscalCode: string;
}

interface CompanyCustomer {
  type: 'company';
  vatNumber: string;
}

/** Unione di varianti: i campi esistono solo per la variante attiva (vedi `applyWhenValue`). */
type Customer = PrivateCustomer | CompanyCustomer;

interface RegistrationModel {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  website: string;
  age: number | null;
  birthDate: Date | null;
  customer: Customer;
  applyDiscount: boolean;
  promoCode: string;
  items: Item[];
}

/** Schema companion riusabile: regole di un campo email, applicabile con `apply()`. */
const emailFieldSchema = schema<string>((path) => {
  required(path);
  email(path);
});


/** Schema di un elemento dell'array, usato con `applyEach()`. */
const itemSchema = schema<Item>((item) => {
  required(item.name);
  required(item.quantity);
  min(item.quantity, 1);
});

/** «Oggi» a mezzanotte UTC, con anno/mese/giorno del fuso dell'utente. */
function todayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

@Component({
  selector: 'app-register',
  imports: [FormRoot, InputText, InputPassword, InputCheckbox, RouterLink],
  templateUrl: './register.html',
  
})
export class Register {

  model = signal<RegistrationModel>({
    username: 'utente.demo',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    website: '',
    age: null,
    birthDate: null,
    customer: { type: 'private', fiscalCode: '' },
    applyDiscount: false,
    promoCode: '',
    items: [{ name: '', quantity: 1 }],
  });

  form = form(
    this.model,
    (p) => {
      // Stato disabilitato: campo non modificabile ed escluso dalla validazione
      disabled(p.username);

      // Schema companion + regole built-in
      apply(p.email, emailFieldSchema);
      required(p.password);
      passwordStrength(p.password); // validatore custom: lunghezza, maiuscola, minuscola, cifra, speciale

      // Regola tra più campi con valueOf()
      required(p.confirmPassword);
      passwordMatch(p.confirmPassword, p.password);

      // pattern() e regola custom
      pattern(p.phone, /^\d{3}-\d{3}-\d{4}$/);
      https(p.website);

      // min / max numerici
      required(p.age);
      min(p.age, 18);
      max(p.age, 120);

      // minDate / maxDate, limiti in UTC
      required(p.birthDate);
      minDate(p.birthDate, new Date('1900-01-01'));
      maxDate(p.birthDate, todayUtc());

      // Regola condizionale con `when`; campo nascosto se lo sconto non è attivo
      required(p.promoCode, { when: ({ valueOf }) => valueOf(p.applyDiscount) });
      hidden(p.promoCode, { when: ({ valueOf }) => !valueOf(p.applyDiscount) });

      // Schema condizionale: regole attive solo con lo sconto
      applyWhen(
        p,
        ({ valueOf }) => valueOf(p.applyDiscount),
        (path) => {
          minLength(path.promoCode, 4);
        },
      );

      // Schemi per variante (§9): ogni blocco vale solo per la sua forma di dato,
      // il type guard dice a TypeScript quale variante si sta validando
      applyWhenValue(
        p.customer,
        (c): c is PrivateCustomer => c.type === 'private',
        (customer) => {
          required(customer.fiscalCode);
          pattern(customer.fiscalCode, /^[A-Z0-9]{16}$/i);
        },
      );
      applyWhenValue(
        p.customer,
        (c): c is CompanyCustomer => c.type === 'company',
        (customer) => {
          required(customer.vatNumber);
          pattern(customer.vatNumber, /^\d{11}$/);
        },
      );

      // Regole su ogni elemento di un array
      applyEach(p.items, itemSchema);
    },
    {
      // Eseguita da [formRoot] solo se il form è valido.
      submission: {
        action: async (field) => {
          console.log('Submitting:', field().value());
        },
      },
    },
  );

  protected readonly customerType = computed(() => this.model().customer.type);

  // I campi di un'unione espongono solo le chiavi comuni: il cast serve al type-check del template.
  protected readonly privateCustomer = this.form.customer as unknown as FieldTree<PrivateCustomer>;
  protected readonly companyCustomer = this.form.customer as unknown as FieldTree<CompanyCustomer>;

  setCustomerType(type: Customer['type']) {
    const customer: Customer =
      type === 'private' ? { type, fiscalCode: '' } : { type, vatNumber: '' };
    this.model.update((m) => ({ ...m, customer }));
  }

  addItem() {
    this.model.update((m) => ({ ...m, items: [...m.items, { name: '', quantity: 1 }] }));
  }

  removeItem(index: number) {
    this.model.update((m) => ({ ...m, items: m.items.filter((_, i) => i !== index) }));
  }
}
