---
sidebar_position: 1
title: Effects
---

# Effects

## useDebouncedEffect

Run an effect after a delay, resetting the timer when dependencies change:

```tsx
useDebouncedEffect(
    () => {
        fetchResults(query);
    },
    [query],
    300,
);
```

Similar to debouncing state, but for side effects (API calls, layout measurement).

## useEffectOnUpdate

Like `useEffect`, but **skips the first mount** — runs only on updates:

```tsx
useEffectOnUpdate(() => {
    saveDraft(formValues);
}, [formValues]);
```

Use when initialization is handled elsewhere and you only want to react to changes.

## useRefresh

Returns `[token, refresh]` where `token` is a number that increments on each `refresh()` call:

```tsx
const [connectionToken, reconnect] = useRefresh();

React.useEffect(() => {
    const socket = connect();
    return () => socket.close();
}, [connectionToken]);
```

Handy for reconnect loops without storing boolean toggles.
