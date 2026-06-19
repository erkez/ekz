---
sidebar_position: 2
title: Getting started
---

# Getting started

## Default provider

The package exports a ready-made provider factory as `DefaultApi`:

```tsx
import { DefaultApi } from '@ekz/api';

function App() {
    return (
        <DefaultApi.ApiClientProvider
            baseUrl="https://api.example.com"
            unauthorizedRedirectPath="/login"
            unauthorizedStatus={[401, 403]}
        >
            <Dashboard />
        </DefaultApi.ApiClientProvider>
    );
}
```

## Calling the API

Use `useApiClient` inside the provider tree:

```tsx
import { DefaultApi } from '@ekz/api';
import React from 'react';

function UserList() {
    const api = DefaultApi.useApiClient();

    React.useEffect(() => {
        api.get<User[]>('/users').then((response) => {
            console.log(response.data);
        });
    }, [api]);

    return null;
}
```

## Custom provider instance

Create a separate factory when you need isolated contexts (e.g. multiple backends):

```tsx
import { apiClientProviderFactory } from '@ekz/api';

const InternalApi = apiClientProviderFactory();

<InternalApi.ApiClientProvider baseUrl="https://internal.example.com">
    ...
</InternalApi.ApiClientProvider>;
```

Each factory has its own React context and `useApiClient` hook.

## Request config

All methods accept an optional `RequestConfig`:

```typescript
api.post<Created>('/users', {
    body: { name: 'Ada' },
    query: { notify: true },
    retryAttempts: 5,
});
```

See the [HTTP client guide](./guide/http-client) for details.
