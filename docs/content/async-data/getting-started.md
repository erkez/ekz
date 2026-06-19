---
sidebar_position: 2
title: Getting started
---

# Getting started

## Constructors

```typescript
import { Empty, Pending, Ready, Failed } from '@ekz/async-data';

const idle = Empty<string>();
const loading = Pending<string>();
const ok = Ready('hello');
const err = Failed<string>(new Error('Network error'));
```

## Transitions

From any state you can move forward with instance methods:

```typescript
let data = Empty<User>();

data = data.pending();           // → Pending
data = data.ready({ id: 1 });    // → Ready
data = data.pending();           // → PendingStale (keeps value)
data = data.fail(new Error());   // → FailedStale (keeps value)
```

## Pattern matching

Use `match` to render by state:

```typescript
const label = data.match(
    {
        Empty: () => 'Not loaded',
        Pending: () => 'Loading…',
        Ready: (user) => user.name,
        Failed: (error) => error.message,
        PendingStale: (user) => `${user.name} (refreshing…)`,
        FailedStale: (user, error) => `${user.name} (error: ${error.message})`,
    },
    () => 'Unknown',
);
```

Handlers are optional — omitted states fall through to `getDefault`.

## Mapping values

`map` and `flatMap` only transform when a value is present; pending/error metadata is preserved:

```typescript
const names = users.map((list) => list.map((u) => u.name));
```

## Option interop

```typescript
import { Option } from '@ekz/option';

const maybeUser: Option<User> = data.toOption();
```

See the [states guide](./guide/states) for when each state applies.
