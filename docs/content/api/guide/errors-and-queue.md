---
sidebar_position: 3
title: Errors and queue
---

# Errors and queue

## Expected API errors

Some backends return structured error payloads. Wrap them with `ExpectedApiError`:

```typescript
import { ExpectedApiError, isExpectedApiError } from '@ekz/api';

try {
    await api.post('/action', { body: payload });
} catch (error) {
    if (isExpectedApiError(error)) {
        // error.failure contains ApiResultFailure
    }
}
```

`ApiResultFailure` carries server-provided error metadata for display or logging.

## Request queue

Limit concurrent requests (default parallelism: 5):

```tsx
import { useRequestQueue } from '@ekz/api';

function BulkLoader() {
    const api = DefaultApi.useApiClient();
    const queue = useRequestQueue<Response>(3);

    const loadAll = (ids: string[]) =>
        Promise.all(ids.map((id) => queue.enqueue(() => api.get(`/items/${id}`))));

    // ...
}
```

`enqueue` returns a Bluebird promise that resolves when the task completes. The queue starts the next task as slots free up.

Use this for bulk operations that would otherwise stampede the server or hit browser connection limits.
