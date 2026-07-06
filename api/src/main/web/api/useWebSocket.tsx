import { useRefresh, useTimeout } from '@ekz/react-utils';
import { List, Set } from 'immutable';
import * as React from 'react';

import { DefaultApi, type ApiClientProviderFactory } from '.';

export interface WebSocketApi<In, Out> {
    send(message: Out): void;
    subscribe(subscriber: MessageSubscriber<In>): () => void;
    onDisconnect(subscriber: () => void): () => void;
    isConnected: boolean;
}

type MessageSubscriber<T> = (message: T) => void;

export function useWebSocket<In, Out>(
    path: string | null,
    searchParams?: string | URLSearchParams | Record<string, string>,
    clientProvider: ApiClientProviderFactory = DefaultApi
): WebSocketApi<In, Out> {
    const apiClient = clientProvider.useApiClient();

    const webSocket = React.useRef<WebSocket | null>(null);
    const [connectionToken, reconnect] = useRefresh();
    const timeout = useTimeout(0);
    const attemptCount = React.useRef(0);

    const subscribers = React.useRef(Set<MessageSubscriber<In>>().asMutable());
    const disconnectSubscribers = React.useRef(Set<() => void>().asMutable());
    const [hasSubscribers, setHasSubscribers] = React.useState(false);
    const [isConnected, setConnected] = React.useState(false);
    const queue = React.useRef<List<Out>>(List<Out>().asMutable());

    const url = React.useMemo(() => {
        const url = new URL(apiClient.baseUrl + path, location as unknown as URL);
        const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = new URL(`${protocol}//${url.host}${url.pathname}`);
        const nextSearchParams = new URLSearchParams(searchParams);
        wsUrl.search =
            typeof searchParams === 'string' ? searchParams : nextSearchParams.toString();
        return wsUrl.href;
    }, [apiClient.baseUrl, path, searchParams]);

    const processQueue = React.useCallback(() => {
        if (webSocket.current != null) {
            queue.current.forEach((message) => webSocket.current?.send(JSON.stringify(message)));
            queue.current.clear();
        }
    }, []);

    const send = React.useCallback(
        (message: Out) => {
            queue.current.push(message);
            processQueue();
        },
        [processQueue]
    );

    const subscribe = React.useCallback((subscriber: MessageSubscriber<In>) => {
        subscribers.current.add(subscriber);
        setHasSubscribers(true);

        return () => {
            subscribers.current.remove(subscriber);

            if (subscribers.current.size === 0) {
                setHasSubscribers(false);
            }
        };
    }, []);

    const onDisconnect = React.useCallback((disconnectSubscriber: () => void) => {
        disconnectSubscribers.current.add(disconnectSubscriber);
        return () => disconnectSubscribers.current.remove(disconnectSubscriber);
    }, []);

    React.useEffect(
        () =>
            timeout(
                () => {
                    if (hasSubscribers) {
                        const socket = new WebSocket(url);

                        socket.binaryType = 'arraybuffer';

                        socket.addEventListener('open', () => {
                            webSocket.current = socket;
                            processQueue();
                            setConnected(true);
                            attemptCount.current = 0;
                        });

                        socket.addEventListener('message', (event) => {
                            const serverMessage = JSON.parse(event.data) as In;
                            subscribers.current.forEach((subscriber) => subscriber(serverMessage));
                        });

                        socket.addEventListener('close', () => {
                            webSocket.current = null;
                            attemptCount.current = 1;
                            disconnectSubscribers.current.forEach((subscriber) => subscriber());
                            setConnected(false);
                            reconnect();
                        });

                        socket.addEventListener('error', () => {
                            webSocket.current = null;
                            attemptCount.current += 1;
                        });

                        return () => socket.close();
                    }
                },
                Math.min(attemptCount.current * 1000, 10000)
            ),
        [processQueue, url, connectionToken, reconnect, timeout, hasSubscribers]
    );

    return React.useMemo(
        () => ({ send, subscribe, onDisconnect, isConnected }),
        [send, subscribe, onDisconnect, isConnected]
    );
}
