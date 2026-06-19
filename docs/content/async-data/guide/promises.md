---
sidebar_position: 2
title: Promises
---

# Observing promises

`observePromise` connects a `Promise` to a state updater — typically React `setState`.

## observePromise

```typescript
import { Empty, observePromise } from '@ekz/async-data';
import React from 'react';

function UserPanel() {
    const [data, setData] = React.useState(() => Empty<User>());

    React.useEffect(() => {
        const cancel = observePromise(
            fetchUser(id),
            (update) => setData((current) => update(current)),
        );

        return cancel;
    }, [id]);

    // render with data.match(...)
}
```

The returned function sets an internal `cancelled` flag so late resolutions do not update state after unmount or dependency change.

Flow:

1. `pending()` is applied immediately
2. On resolve → `ready(value)`
3. On reject → `fail(error)`

## observePromiseGS

Convenience wrapper when you have separate getter/setter:

```typescript
observePromiseGS(fetchUser(id), () => data, setData);
```

## Stale reloads

To keep showing the previous user while refetching:

```typescript
setData((current) => current.pending());
observePromise(fetchUser(id), (update) => setData((current) => update(current)));
```

If `current` already holds a user, the state becomes `PendingStale`.

## React patterns

- Return the unsubscribe function from `useEffect`
- Reset to `Empty()` when inputs change if you do not want stale UI
- Prefer `match` in render over branching on booleans
