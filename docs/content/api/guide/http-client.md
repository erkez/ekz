---
sidebar_position: 1
title: HTTP client
---

# HTTP client

## ApiClient

`createApiClient(baseUrl, options)` returns an client with:

| Method | Description |
| ------ | ----------- |
| `get` | GET request |
| `post` | POST with body |
| `put` | PUT with body |
| `patch` | PATCH with body |
| `delete` | DELETE |
| `execute` | arbitrary HTTP method |

All methods return **Bluebird** promises of `AxiosResponse<T>`.

## RequestConfig

```typescript
interface RequestConfig<Body> {
    query?: Record<string, unknown>;
    headers?: Record<string, unknown>;
    body?: Body;
    responseType?: ResponseType;
    skipAuthentication?: boolean;
    retryAttempts?: number;
    retryNumber?: number;
}
```

- **`query`** — serialized with `stringifyQueryParams` (nested objects supported)
- **`withCredentials`** — cookies sent automatically (Axios default in this client)
- **`retryAttempts`** — defaults to 3 with exponential backoff (cap 30s)
- **`skipAuthentication`** — skip unauthorized redirect on matching status codes

## Unauthorized handling

`ApiClientOptions`:

```typescript
{
    unauthorizedRedirectPath?: string;  // default '/'
    unauthorizedStatus?: number[];      // default [401]
}
```

When a response matches, the browser navigates to the redirect path unless `skipAuthentication` is set on the request.

## Query string helper

```typescript
import { stringifyQueryParams } from '@ekz/api';

stringifyQueryParams({ filter: { active: true }, page: 1 });
```

Useful outside the client when building URLs manually.
