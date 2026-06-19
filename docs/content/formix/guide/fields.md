---
sidebar_position: 2
title: Fields
---

# Fields

Formix models form state as **field references** created with `defineField` and `defineArrayField`.

## Scalar fields

```tsx
import { defineField } from '@ekz/formix';

const refs = {
    email: defineField(''),
    age: defineField(0),
};
```

Pass initial values when editing existing entities:

```tsx
defineField(entity?.email ?? '');
```

## Binding with useField

```tsx
const { value, setValue, error, touched, setTouched } = useField(field);

<input
    value={value}
    onChange={(e) => setValue(e.target.value)}
    onBlur={() => setTouched(true)}
/>;
```

`error` is populated when a validator returns a message and the field is `touched`.

## Array fields

Dynamic lists use `defineArrayField` and `useArrayField`:

```tsx
import { defineArrayField, defineField } from '@ekz/formix';
import { List } from 'immutable';

function defineItemField(item?: Item) {
    return {
        label: defineField(item?.label ?? ''),
    };
}

const items = defineArrayField(List<ItemFieldRefs>(), defineItemField);
```

```tsx
const { items, push, remove, move } = useArrayField(field);

items.map((itemRef, index) => (
    <ItemRow key={itemRef.id} field={itemRef} onRemove={() => remove(index)} />
));
```

## Immutable collections

Formix works well with [immutable.js](https://immutable-js.github.io/immutable-js/) `Set`, `List`, and `Map` as field values — especially for tags, ordered lists, and deduplication.

## Field metadata

Field refs carry stable identities across renders. Use the same ref object for `useField`, `useFieldValidation`, and `getValues`.

## Anti-patterns

- **Raw `useState` per input** — loses shared `valid` / `modified` and cross-field validation
- **String keys** — `values.email` breaks ref safety; use `FieldRef` instead
- **Validation in save handlers** — use `useFieldValidation` so submit stays disabled until fixed
