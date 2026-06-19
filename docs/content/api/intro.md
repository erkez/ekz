---
slug: /
sidebar_position: 1
title: Introduction
---

# API

**API** (`@ekz/api`) provides a typed HTTP client and WebSocket hook for React apps, built on Axios and Bluebird promises.

## Features

- **`ApiClientProvider`** — inject a configured client via React context
- **HTTP verbs** — `get`, `post`, `put`, `patch`, `delete` returning Bluebird promises
- **Retries & auth redirect** — configurable retry backoff and unauthorized handling
- **`useWebSocket`** — reconnecting WebSocket with queued outbound messages
- **`useRequestQueue`** — limit parallel in-flight requests

## Dependencies

Works with other `@ekz` packages:

- [`@ekz/react-utils`](https://docs.ekz.io/react-utils/) — timers used by WebSocket reconnect
- [`@ekz/async-data`](https://docs.ekz.io/async-data/) — model fetch lifecycle in UI
- [`@ekz/option`](https://docs.ekz.io/option/) — optional values in API layers

## Install

```bash
npm install @ekz/api @ekz/react-utils immutable react
```

Peer dependencies: `react`, `react-dom`, `immutable`.

## Next steps

- [Getting started](./getting-started) — mount the provider and call the API
- [HTTP client](./guide/http-client) — requests, query params, options
- [WebSockets](./guide/websockets) — `useWebSocket`
- [Errors & queue](./guide/errors-and-queue) — expected errors and concurrency
