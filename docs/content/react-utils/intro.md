---
slug: /
sidebar_position: 1
title: Introduction
---

# React Utils

**React Utils** (`@ekz/react-utils`) is a collection of small, focused React hooks and helpers used across `@ekz` libraries and applications.

## What's included

| Area | Hooks |
| ---- | ----- |
| Effects | `useDebouncedEffect`, `useEffectOnUpdate`, `useRefresh` |
| Timers | `useDebounce`, `useTimeout`, `useInterval` |
| Storage | `useLocalStorage`, `useSessionStorage`, `useStoredValue` |
| Time | `useClock`, `toDateTime`, Luxon helpers |
| Browser | `useWindowFocusDetection` |
| UI state | `useToggle` |
| TypeScript | `unreachable` exhaustiveness helper |

## Install

```bash
npm install @ekz/react-utils react
```

Peer dependencies: `react`, `react-dom`. Uses [Luxon](https://moment.github.io/luxon/) for time utilities.

## Used by

- [`@ekz/api`](https://docs.ekz.io/api/) — WebSocket reconnect timing
- [`@ekz/blueprintjs`](https://www.npmjs.com/package/@ekz/blueprintjs) — table and UI behaviors

## Next steps

- [Getting started](./getting-started)
- [Effects](./guide/effects)
- [Timers](./guide/timers)
- [Storage & time](./guide/storage-and-time)
