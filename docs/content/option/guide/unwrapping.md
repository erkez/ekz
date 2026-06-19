---
sidebar_position: 3
title: Unwrapping
---

# Unwrapping

## Prefer safe extractors

| Method | When empty | When present |
| ------ | ---------- | ------------ |
| `getOrElse(() => x)` | returns `x` from thunk | returns value |
| `getOrReturn(x)` | returns `x` | returns value |
| `getOrUndefined()` | `undefined` | value |
| `get()` | **throws** | value |

Use lazy `getOrElse` when the default is expensive:

```typescript
opt.getOrElse(() => computeDefault());
```

Use `getOrReturn` for constants:

```typescript
opt.getOrReturn(-1);
```

## get() — use sparingly

```typescript
Some('ok').get(); // 'ok'
None.get();       // throws Error: No such element
```

Only call `get()` when you have already checked `isDefined`, or immediately after a branch that narrows the type in your own code.

## Interop patterns

**With async-data:**

```typescript
import { Option } from '@ekz/option';
import type { AsyncData } from '@ekz/async-data';

function toUser(data: AsyncData<User>): Option<User> {
    return data.toOption();
}
```

**With nullable APIs:**

```typescript
const name = Option.of(apiResponse?.name).getOrReturn('Anonymous');
```

**With arrays:**

```typescript
const first = Option.of(items[0]);
```

## Anti-patterns

- Using `get()` instead of `getOrElse` / `getOrUndefined`
- Converting to `undefined` and back repeatedly — stay in `Option` through the pipeline
- Using `Option.of` when you mean `Some` and the value must not be coerced from null
