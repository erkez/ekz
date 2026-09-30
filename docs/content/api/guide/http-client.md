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
    headers?: RawAxiosRequestHeaders;
    body?: Body;
    responseType?: ResponseType;
    skipAuthentication?: boolean;
    retryAttempts?: number;
    retryNumber?: number;
}
```

- **`query`** — serialized with `stringifyQueryParams`: `null`/`undefined` values are omitted, arrays
  repeat the key (`a=1&a=2`), nested objects use bracket notation (`filter[active]=true`)
- **`headers`** — sent with the request, merged over anything `onRequest` adds
- **`retryAttempts`** — retries on `504` or a network error with exponential backoff (cap 30s). Defaults to 3 for
  `GET`, `HEAD`, `OPTIONS`, `PUT` and `DELETE`, and to 0 for `POST` and `PATCH`, whose response may
  have been lost *after* the server acted on it; set it explicitly to retry those anyway
- **`skipAuthentication`** — skip unauthorized handling on matching status codes

## Client options

`ApiClientOptions` (also accepted as props by `ApiClientProvider`):

```typescript
{
    unauthorizedRedirectPath?: string;  // default '/'
    unauthorizedStatus?: number[];      // default [401]
    withCredentials?: boolean;          // default true
    onRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig | PromiseLike<AxiosRequestConfig>;
    onUnauthorized?: (error: AxiosError, retry: () => Bluebird<AxiosResponse>) => PromiseLike<AxiosResponse> | void;
}
```

- **`withCredentials`** — whether cookies are sent; turn it off for a client that authenticates
  with a bearer token instead of a session cookie
- **`onRequest`** — runs before every attempt, including retries, and its return value is what is
  sent
- **`onUnauthorized`** — see below

## Unauthorized handling

When a response status is in `unauthorizedStatus` and the request did not set `skipAuthentication`:

- without `onUnauthorized`, the browser navigates to `unauthorizedRedirectPath`
- with `onUnauthorized`, the handler decides. Return a promise to resolve the request with it — normally
  the result of `retry()`, which re-sends the request once (further calls return the same promise).
  Return nothing to let the error propagate. A retry that is refused again propagates without calling
  the handler a second time.

### Bearer-token authentication

```tsx
import { DefaultApi, type RequestHook, type UnauthorizedHandler } from '@ekz/api';

const tokens = { access: '' };

const attachToken: RequestHook = (config) => ({
    ...config,
    headers: { ...config.headers, Authorization: `Bearer ${tokens.access}` }
});

const refreshAndRetry: UnauthorizedHandler = async (_error, retry) => {
    tokens.access = await refreshAccessToken();
    return retry();
};

<DefaultApi.ApiClientProvider
    baseUrl="https://api.example.com"
    withCredentials={false}
    onRequest={attachToken}
    onUnauthorized={refreshAndRetry}
>
    <App />
</DefaultApi.ApiClientProvider>;
```

Define the handlers outside the component or memoize them: the provider builds a new client whenever
one of them changes identity.

## Query string helper

```typescript
import { stringifyQueryParams } from '@ekz/api';

stringifyQueryParams({ filter: { active: true }, page: 1 });
```

Useful outside the client when building URLs manually.
