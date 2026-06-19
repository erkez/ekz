---
sidebar_position: 2
title: Getting started
---

# Getting started

This walkthrough builds a minimal name + tags form.

## 1. Define field refs

```tsx title="types.ts"
import { defineField, type FieldRef } from '@ekz/formix';
import { Set } from 'immutable';

export type ProfileFieldRefs = {
    name: FieldRef<string>;
    tags: FieldRef<Set<string>>;
};

export function defineProfileFields(initial?: {
    name?: string;
    tags?: Set<string>;
}): ProfileFieldRefs {
    return {
        name: defineField(initial?.name ?? ''),
        tags: defineField(initial?.tags ?? Set<string>()),
    };
}

export type ProfilePayload = {
    name: string;
    tags: string[];
};

export function getProfileValues(
    refs: ProfileFieldRefs,
    getValues: (ref: FieldRef<unknown>) => unknown,
): ProfilePayload {
    return {
        name: getValues(refs.name) as string,
        tags: (getValues(refs.tags) as Set<string>).toArray(),
    };
}
```

## 2. Wrap the form

```tsx title="ProfileForm.tsx"
import React from 'react';
import { useForm, withForm } from '@ekz/formix';
import { defineProfileFields, getProfileValues } from './types';

type Props = {
    onSave: (payload: ReturnType<typeof getProfileValues>) => void;
};

function ProfileForm({ onSave }: Props) {
    const fieldRefs = React.useMemo(() => defineProfileFields(), []);
    const { getValues, modified, valid } = useForm();

    const handleSave = React.useCallback(() => {
        onSave(getProfileValues(fieldRefs, getValues));
    }, [fieldRefs, getValues, onSave]);

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                handleSave();
            }}
        >
            <NameInput field={fieldRefs.name} />
            <button type="submit" disabled={!modified || !valid}>
                Save
            </button>
        </form>
    );
}

export const ProfileFormWithContext = withForm(ProfileForm);
```

## 3. Bind an input

```tsx title="NameInput.tsx"
import React from 'react';
import { useField, useFieldValidation, type FieldRef } from '@ekz/formix';

const REQUIRED = 'Name is required.';

export function NameInput({ field }: { field: FieldRef<string> }) {
    const { value, setValue, error, touched } = useField(field);

    useFieldValidation(
        field,
        React.useCallback((name) => (name.trim() === '' ? REQUIRED : null), []),
    );

    return (
        <label>
            Name
            <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
            />
            {touched && error != null ? <span role="alert">{error}</span> : null}
        </label>
    );
}
```

## 4. Render

```tsx
<ProfileFormWithContext onSave={(payload) => console.log(payload)} />
```

## What you get

- `modified` — `true` after the user changes a field
- `valid` — `false` while any registered validator returns an error
- `getValues` — read current values through field refs for serialization

Continue with the [form shell guide](./guide/form-shell) and [validation guide](./guide/validation) for modals, array fields, and cross-field rules.
