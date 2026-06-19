---
slug: /
sidebar_position: 1
title: Introduction
---

# Async Data

**Async Data** (`@ekz/async-data`) models the lifecycle of asynchronous values — loading, success, failure, and stale cached data — in a type-safe container inspired by functional patterns.

It pairs well with [`@ekz/option`](https://www.npmjs.com/package/@ekz/option) for optional values and is used throughout the `@ekz` libraries (for example in `@ekz/api`).

## Why use it?

- **Explicit states** instead of ad-hoc `loading` / `error` / `data` booleans
- **Stale-while-revalidate** via `PendingStale` and `FailedStale`
- **`match` API** for exhaustive rendering
- **`observePromise`** to wire promises into React state safely

## States

| State | Meaning |
| ----- | ------- |
| `Empty` | No value yet |
| `Pending` | Loading, no previous value |
| `Ready` | Success with a value |
| `PendingStale` | Reloading, showing previous value |
| `Failed` | Error, no previous value |
| `FailedStale` | Error after a previous value was loaded |

## Install

```bash
npm install @ekz/async-data @ekz/option
# or
yarn add @ekz/async-data @ekz/option
```

Peer dependency: `@ekz/option` ^2.

## Next steps

- [Getting started](./getting-started) — create and transition states
- [States](./guide/states) — state machine details
- [Promises](./guide/promises) — `observePromise` in React
- [Extractors](./guide/extractors) — `@ekz/async-data/extractors`
