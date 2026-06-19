# @ekz/api

HTTP and WebSocket client for React.

**Documentation:** [https://docs.ekz.io/api/](https://docs.ekz.io/api/)

## Install

```bash
npm install @ekz/api @ekz/react-utils immutable react
```

## Quick example

```tsx
import { DefaultApi } from '@ekz/api';

<DefaultApi.ApiClientProvider baseUrl="https://api.example.com">
    <App />
</DefaultApi.ApiClientProvider>;

// inside App:
const api = DefaultApi.useApiClient();
api.get<User[]>('/users').then((r) => console.log(r.data));
```

See the [docs](https://docs.ekz.io/api/) for WebSockets, retries, and request queuing.
