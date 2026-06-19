---
sidebar_position: 1
title: Constructors
---

# Constructors

## Option.of

The primary way to lift nullable values:

```typescript
Option.of(value);
```

| Input | Result |
| ----- | ------ |
| `null` | `None` |
| `undefined` | `None` |
| any other value | `Some(value)` |

## Some

Creates a non-empty option unconditionally:

```typescript
Some(0);
Some('');
Some(null); // Option<null> — isDefined is true
```

Use when the value is already known to be present.

## None

Singleton empty option:

```typescript
import { None } from '@ekz/option';

const missing: Option<string> = None;
```

Also available as `Option.None` after the module loads.

## Do not use `new Option()`

The constructor is private. Always use `Option.of`, `Some`, or `None` — otherwise an error is thrown.

## Static aliases

```typescript
Option.Some(1);
Option.None;
```

Equivalent to the exported `Some` function and `None` constant.
