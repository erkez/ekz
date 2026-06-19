---
sidebar_position: 3
title: Validation
---

# Validation

Register rules with `useFieldValidation`. Validators run when the field value changes (and when optional dependencies change).

## Basic rule

```tsx
const REQUIRED = 'This field is required.';

useFieldValidation(
    field,
    React.useCallback((value: string) => (value.trim() === '' ? REQUIRED : null), []),
);
```

- Return `null` when valid
- Return a `string` or `ReactNode` for the error message
- Errors display when the field is `touched`

## Stable error references

**Important:** the returned error must be **referentially stable** when the outcome is unchanged.

Returning a new JSX element every run can cause re-render loops, especially on array fields:

```tsx
// Avoid — new element every validation
useFieldValidation(field, (value) =>
    value === '' ? <span>Required</span> : null,
);
```

Prefer module-level constants:

```tsx
const REQUIRED_ERROR = 'Required.';

useFieldValidation(
    field,
    React.useCallback((value) => (value === '' ? REQUIRED_ERROR : null), []),
);
```

Wrap validators in `React.useCallback` with minimal dependencies.

## Cross-field validation

Pass dependent field refs as the third argument:

```tsx
useFieldValidation(
    emailField,
    React.useCallback((email, [confirm]) => {
        return email === confirm ? null : 'Emails must match.';
    }, []),
    [confirmEmailField],
);
```

Formix revalidates when any dependency value changes.

## Array-level rules

Validate the whole list (e.g. “at least one item”):

```tsx
const NO_ITEMS = 'Add at least one item.';

useFieldValidation(
    itemsField,
    React.useCallback((items: List<Item>) => (items.isEmpty() ? NO_ITEMS : null), []),
);
```

Show list-level errors from the array field:

```tsx
const { error, touched } = useField(itemsField);

{
    touched && error != null ? <p role="alert">{error}</p> : null;
}
```

Per-row rules belong on row components; list-level rules on the array container.

## Async validation

Use `useAsyncFieldValidation` or `useAsyncFieldStateValidation` when validation requires a network round-trip (e.g. checking username availability).

## Submit gating

With validators registered, `useForm().valid` reflects the full form. Pair with `modified` on edit forms:

```tsx
<button disabled={!modified || !valid}>Save</button>
```

Do not duplicate validation only in the save handler — the button would stay enabled while invalid.
