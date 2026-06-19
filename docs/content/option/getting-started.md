---
sidebar_position: 2
title: Getting started
---

# Getting started

## Creating options

```typescript
import { Option, Some, None } from '@ekz/option';

Option.of(42);        // Some(42)
Option.of(null);      // None
Option.of(undefined); // None

Some('text');         // Some('text')
None;                 // None (singleton)
```

`Option.of` treats both `null` and `undefined` as absent. Use `Some(null)` when you intentionally need `Option<null>`.

## Checking presence

```typescript
const opt = Option.of(user);

opt.isDefined; // true if Some
opt.isEmpty;   // true if None
```

Prefer these over comparing to `None` directly unless you need reference equality.

## Safe extraction

Avoid bare `get()` on options that might be empty — it throws on `None`.

```typescript
// Default when empty
opt.getOrElse(() => 'guest');

// Literal fallback
opt.getOrReturn('guest');

// Interop with undefined-based APIs
opt.getOrUndefined();
```

## Side effects

```typescript
opt.forEach((value) => console.log(value));
```

Runs only when the option is non-empty.

## Equality

```typescript
Some(1).equals(Some(1)); // true
Some(1).equals(None);    // false
None.equals(None);        // true
```

Values are compared with `===` when both sides are `Some`.

## JSON

`toJSON()` unwraps `Some` for serialization (and delegates to nested `toJSON` when present):

```typescript
JSON.stringify(Some({ id: 1 })); // {"id":1}
JSON.stringify(None);            // null
```

See the [transformations guide](./guide/transformations) for chaining operations.
