import { render } from '@testing-library/react';
import type { List } from 'immutable';

import { useFormWithFields, withForm } from '../form';
import { defineField } from '../references';
import type { FieldRef, FormApi } from '../types';
import { useAsyncFieldValidation, useFieldValidation } from '../validation/fields';

const REQUIRED = 'Required';

function required(value: string): string | null {
    return value === '' ? REQUIRED : null;
}

function never(): Promise<string | null> {
    return new Promise(() => undefined);
}

describe('form validation state', () => {
    it('enumerates the fields that have errors', () => {
        let form: FormApi | undefined;
        let refs: { name: FieldRef<string>; city: FieldRef<string>; street: FieldRef<string> };

        const Form = withForm(function Form() {
            const result = useFormWithFields(
                () => ({ name: defineField('ok'), city: defineField(''), street: defineField('') }),
                []
            );
            useFieldValidation(result.fields.name, required);
            useFieldValidation(result.fields.city, required);
            useFieldValidation(result.fields.street, required);
            form = result;
            refs = result.fields;
            return null;
        });

        render(<Form />);

        const invalid: List<FieldRef<unknown>> = form!.invalidFields;
        expect(invalid.size).toBe(2);
        expect(invalid.includes(refs!.city)).toBe(true);
        expect(invalid.includes(refs!.street)).toBe(true);
        expect(form!.hasErrors).toBe(true);
        expect(form!.valid).toBe(false);
    });

    it('reports a pending async validation as neither valid nor erroneous', () => {
        let form: FormApi | undefined;

        const Form = withForm(function Form() {
            const result = useFormWithFields(() => ({ name: defineField('taken?') }), []);
            useAsyncFieldValidation(result.fields.name, never);
            form = result;
            return null;
        });

        render(<Form />);

        expect(form!.pending).toBe(true);
        expect(form!.hasErrors).toBe(false);
        expect(form!.invalidFields.isEmpty()).toBe(true);
        expect(form!.valid).toBe(false);
    });

    it('is valid with no errors and nothing pending', () => {
        let form: FormApi | undefined;

        const Form = withForm(function Form() {
            const result = useFormWithFields(() => ({ name: defineField('ok') }), []);
            useFieldValidation(result.fields.name, required);
            form = result;
            return null;
        });

        render(<Form />);

        expect(form!.invalidFields.isEmpty()).toBe(true);
        expect(form!.hasErrors).toBe(false);
        expect(form!.valid).toBe(true);
    });
});
