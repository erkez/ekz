---
sidebar_position: 2
title: Timers
---

# Timers

## useDebounce

Debounce a value — the returned value updates only after `delay` ms of stability:

```tsx
const debouncedSearch = useDebounce(searchTerm, 250);
```

Use the debounced value in effects or child props to avoid excessive work.

## useTimeout / useInterval

Schedule callbacks with stable timer handles:

```tsx
const schedule = useTimeout(0);

schedule(() => reconnect(), 1000);

const every = useInterval(1000);
every(() => tick(), 1000);
```

Default delay argument sets the initial duration when omitted in the schedule call pattern used internally by `@ekz/api` WebSocket reconnect.

## When to use which

| Hook | Use case |
| ---- | -------- |
| `useDebounce` | Input fields, filter text |
| `useDebouncedEffect` | Side effects tied to changing input |
| `useTimeout` | One-shot delayed actions |
| `useInterval` | Polling, clocks, periodic refresh |
