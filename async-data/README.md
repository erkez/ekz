# @ekz/async-data

Type-safe async state for promises.

**Documentation:** [https://docs.ekz.io/async-data/](https://docs.ekz.io/async-data/)

## Install

```bash
npm install @ekz/async-data @ekz/option
```

## Quick example

```typescript
import { Empty, Ready, observePromise } from '@ekz/async-data';

let data = Empty<User>();

data = data.pending();
data = Ready({ id: 1, name: 'Ada' });

const label = data.match(
    {
        Ready: (user) => user.name,
        Pending: () => 'Loading…',
    },
    () => '—',
);
```

See the [docs](https://docs.ekz.io/async-data/) for states, promise observation, and extractors.
