---
sidebar_position: 3
title: Extractors
---

# Extractors

The `@ekz/async-data/extractors` entry point provides small helpers for conditional rendering without full `match` blocks.

```typescript
import { renderReady, renderFailed, renderPending } from '@ekz/async-data/extractors';
```

## API

| Function | Runs when |
| -------- | --------- |
| `render(ad, f)` | `ad.nonEmpty` |
| `renderReady(ad, f)` | `ad.isReady` |
| `renderStale(ad, f)` | `ad.isStale` |
| `renderPending(ad, f)` | `ad.isPending` (passes duration ms) |
| `renderFailed(ad, f)` | `ad.isFailed` |
| `renderEmpty(ad, f)` | `ad.isEmpty` |

Each returns `R | null` — `null` when the predicate does not match.

## Example

```tsx
{renderReady(data, (user) => <UserCard user={user} />)}
{renderPending(data, (ms) => <Spinner label={`${ms}ms`} />)}
{renderFailed(data, (error) => <ErrorCallout error={error} />)}
```

Use `match` when you need exhaustive handling in one expression; use extractors for scattered UI branches in JSX.
