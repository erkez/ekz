---
slug: /
sidebar_position: 1
title: Introduction
---

# Option

**Option** (`@ekz/option`) is a TypeScript port of Scala's `Option` / `Maybe` type. It replaces `null` and `undefined` in domain logic with an explicit **Some** or **None**.

## Why use Option?

- **No surprise nulls** — absence is part of the type
- **Composable** — `map`, `flatMap`, and `filter` chain without nested conditionals
- **Foundation for `@ekz`** — used by `@ekz/async-data`, `@ekz/formix` peer deps, and app code

An `Option<A>` is either:

- **`Some(value)`** — a present value (including `null` as `Option<null>` if you construct it explicitly)
- **`None`** — no value

## Install

```bash
npm install @ekz/option
# or
yarn add @ekz/option
```

Zero runtime dependencies.

## Quick taste

```typescript
import { Option, Some, None } from '@ekz/option';

const doubled = Option.of(maybeNumber).map((n) => n * 2).getOrElse(() => 0);

Some('hello')
    .flatMap((s) => Some(`${s}!`))
    .getOrUndefined(); // 'hello!'
```

## Next steps

- [Getting started](./getting-started) — create options and read values safely
- [Constructors](./guide/constructors) — `Some`, `None`, `Option.of`
- [Transformations](./guide/transformations) — `map`, `flatMap`, `filter`
- [Unwrapping](./guide/unwrapping) — `getOrElse`, `getOrUndefined`, and when not to call `get()`
