---
sidebar_position: 3
title: Storage and time
---

# Storage and time

## Local and session storage

```tsx
import { useLocalStorage, useSessionStorage } from '@ekz/react-utils';

const prefs = useLocalStorage('prefs', {
    defaultValue: { compact: false },
    serialize: JSON.stringify,
    deserialize: (raw) => JSON.parse(raw),
});

prefs.value.compact;
prefs.set({ compact: true });
prefs.update((prev) => ({ ...prev, compact: !prev.compact }));
prefs.delete();
```

`useSessionStorage` is identical but uses `sessionStorage`.

`StoredValue` syncs across tabs via storage events through `StorageService`.

## useClock

Live clock with optional tick interval and locale:

```tsx
const clock = useClock(1000, 'de-DE');

clock.now; // Luxon DateTime, updates each tick
clock.format('HH:mm');
```

## Date helpers

```typescript
import { toDateTime, type ISODate } from '@ekz/react-utils';

toDateTime('2024-01-15');
toDateTime(isoDateString as ISODate);
```

`ISODate` is an opaque branded string type for ISO date literals.

## useWindowFocusDetection

```tsx
const focused = useWindowFocusDetection();

if (!focused) {
    // pause polling, reduce animations, etc.
}
```

## useToggle

```tsx
const modal = useToggle(false);

modal.open();
modal.close();
modal.toggle();
modal.isOpen;
```

## unreachable

Exhaustiveness check for discriminated unions:

```typescript
switch (state.kind) {
    case 'a':
        return handleA(state);
    case 'b':
        return handleB(state);
    default:
        return unreachable(state);
}
```

TypeScript ensures all cases are handled; runtime throws if not.
