import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { https } from './url.validator';

describe('https (Signal Forms)', () => {
  function createForm(website: string) {
    return TestBed.runInInjectionContext(() =>
      form(signal({ website }), (p) => {
        https(p.website);
      }),
    );
  }

  it('accetta un URL https', () => {
    expect(createForm('https://example.com').website().valid()).toBe(true);
  });

  it('accetta il campo vuoto', () => {
    expect(createForm('').website().valid()).toBe(true);
  });

  it('rifiuta un URL http con kind "https"', () => {
    const f = createForm('http://example.com');
    expect(f.website().errors().map((e) => e.kind)).toEqual(['https']);
  });

  it('rifiuta un testo senza protocollo', () => {
    expect(createForm('example.com').website().invalid()).toBe(true);
  });
});
