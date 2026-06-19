# @ekz/react-utils

React hooks and utilities.

**Documentation:** [https://docs.ekz.io/react-utils/](https://docs.ekz.io/react-utils/)

## Install

```bash
npm install @ekz/react-utils react
```

## Quick example

```tsx
import { useDebounce, useToggle } from '@ekz/react-utils';

const debouncedQuery = useDebounce(query, 300);
const panel = useToggle(false);
```

See the [docs](https://docs.ekz.io/react-utils/) for effects, storage, and time helpers.
