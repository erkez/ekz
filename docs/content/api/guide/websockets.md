---
sidebar_position: 2
title: WebSockets
---

# WebSockets

## useWebSocket

```tsx
import { useWebSocket } from '@ekz/api';

type In = { type: 'update'; payload: string };
type Out = { type: 'subscribe'; channel: string };

function LiveFeed() {
    const ws = useWebSocket<In, Out>('/ws/feed', { token: sessionToken });

    React.useEffect(() => {
        return ws.subscribe((message) => {
            if (message.type === 'update') {
                console.log(message.payload);
            }
        });
    }, [ws]);

    React.useEffect(() => {
        if (ws.isConnected) {
            ws.send({ type: 'subscribe', channel: 'news' });
        }
    }, [ws, ws.isConnected]);

    return <span>{ws.isConnected ? 'Live' : 'Reconnecting…'}</span>;
}
```

Must be used under an `ApiClientProvider` — the hook reads `baseUrl` from `useApiClient()` to build the WebSocket URL (`ws:` / `wss:`).

## WebSocketApi

| Member | Description |
| ------ | ----------- |
| `send(message)` | JSON-serialize and send; queues until connected |
| `subscribe(fn)` | receive parsed inbound messages; returns unsubscribe |
| `onDisconnect(fn)` | notified on connection loss; returns unsubscribe |
| `isConnected` | current connection state |

## Reconnection

The hook reconnects with backoff when the socket closes and subscribers exist. Pass `path={null}` to tear down the connection.

## Custom provider

```tsx
useWebSocket<In, Out>('/ws', params, InternalApi);
```

Third argument is an `ApiClientProviderFactory` (defaults to `DefaultApi`).
