---
sidebar_position: 2
title: Getting started
---

# Getting started

Import hooks directly from the package:

```tsx
import {
    useDebounce,
    useDebouncedEffect,
    useRefresh,
    useToggle,
    useLocalStorage,
} from '@ekz/react-utils';
```

## Debounced search

```tsx
function Search({ onSearch }: { onSearch: (q: string) => void }) {
    const [query, setQuery] = React.useState('');
    const debounced = useDebounce(query, 300);

    useDebouncedEffect(() => onSearch(debounced), [debounced], 300);

    return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

## Force re-render / reconnect token

```tsx
const [token, refresh] = useRefresh();

// pass token as dependency key; call refresh() to bump
```

## Persisted preference

```tsx
const theme = useLocalStorage('theme', {
    defaultValue: 'light',
    serialize: (v) => v,
    deserialize: (v) => v as 'light' | 'dark',
});

<button onClick={() => theme.set('dark')}>Dark mode</button>
```

See the guides for the full API of each hook group.
