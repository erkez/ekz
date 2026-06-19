---
sidebar_position: 2
title: Transformations
---

# Transformations

## map

Transform the inner value when present; otherwise return `None`:

```typescript
Some(2).map((n) => n + 1); // Some(3)
None.map((n) => n + 1);    // None
```

## mapNullable

Like `map`, but treats a `null`/`undefined` result as `None`:

```typescript
Some('42').mapNullable((s) => parseInt(s, 10) || null);
Some('abc').mapNullable((s) => parseInt(s, 10) || null); // None
```

Useful when the mapping function returns nullable values.

## flatMap

Chain options without nesting `Option<Option<A>>`:

```typescript
const parseId = (raw: string): Option<number> =>
    Option.of(Number.parseInt(raw, 10)).filter((n) => !Number.isNaN(n));

Some('7').flatMap(parseId); // Some(7)
Some('x').flatMap(parseId); // None
```

## filter

Keep the value only when the predicate passes:

```typescript
Some(4).filter((n) => n % 2 === 0); // Some(4)
Some(3).filter((n) => n % 2 === 0); // None
None.filter(() => true);             // None
```

## Chaining

```typescript
Option.of(rawEmail)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.includes('@'))
    .getOrElse(() => 'invalid@example.com');
```

Each step short-circuits on `None`.
