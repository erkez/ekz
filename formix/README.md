# @ekz/formix

Type-safe React forms for TypeScript.

**Documentation:** [https://docs.ekz.io/formix/](https://docs.ekz.io/formix/)

## Install

```bash
npm install @ekz/formix @ekz/option immutable react
```

## Quick example

```tsx
import { defineField, useField, useForm, withForm } from '@ekz/formix';

const fields = { name: defineField('') };

function NameForm() {
    const { value, setValue } = useField(fields.name);
    const { valid } = useForm();

    return (
        <input value={value} onChange={(e) => setValue(e.target.value)} />
    );
}

export const NameFormWithContext = withForm(NameForm);
```

See the [docs](https://docs.ekz.io/formix/) for validation, array fields, and form shell patterns.
