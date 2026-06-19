---
sidebar_position: 1
title: States
---

# States

`AsyncData<A>` tracks three internal signals: optional **value**, optional **error**, and optional **pending start time** (via Luxon `DateTime`). The public `state` field derives from their combination.

## State diagram (simplified)

```
Empty ──pending()──► Pending ──ready(v)──► Ready
  │                    │                      │
  │                    │ fail(e)              │ pending()
  │                    ▼                      ▼
  │                 Failed              PendingStale
  │                    │                      │
  │                    │                      │ ready(v) / fail(e)
  └────────────────────┴──────────────────────┘
```

## Predicates

| Property | True when |
| -------- | --------- |
| `isEmpty` | No value stored |
| `nonEmpty` | Value is present |
| `isPending` | A pending start time is set |
| `isReady` | Has value and is not stale |
| `isStale` | Has value and (pending or failed) |
| `isFailed` | An error is stored |

`isReady` means “show the success path.” `isStale` means “we have a value but should indicate loading or error overlay.”

## Duration

While pending, `duration()` returns elapsed milliseconds since `pending()` was called (Luxon UTC by default):

```typescript
data.duration().map((ms) => `${ms}ms`);
```

## Zipping

`zip` combines two `AsyncData` values into a tuple. Pending start times and errors merge according to the “latest start” and “first error wins” rules — useful when coordinating parallel requests.

## Immutability

All transitions return **new** instances. Store the latest reference in React state or a reducer; do not mutate in place.
