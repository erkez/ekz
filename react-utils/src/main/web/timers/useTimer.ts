import * as React from 'react';

type MaybeCleanup = (() => void) | void;

interface CallbackWithCleanup {
    (): MaybeCleanup;
}

interface TimeoutCallback {
    (timeoutHandler: CallbackWithCleanup, timeoutDurationMs?: number): () => void;
    cancel(): void;
}

export function useTimer(
    defaultTimeoutDurationMs = 0,
    timerFunction: TimerFunction = setTimeout
): TimeoutCallback {
    const timeoutId = React.useRef<NodeJS.Timeout>(undefined);
    const callbackCleanup = React.useRef<MaybeCleanup>(undefined);

    const clear = React.useCallback(() => {
        if (timeoutId.current != null) {
            if (timerFunction === setTimeout) {
                clearTimeout(timeoutId.current);
            } else {
                clearInterval(timeoutId.current);
            }
        }

        if (typeof callbackCleanup.current === 'function') {
            callbackCleanup.current();
            callbackCleanup.current = undefined;
        }
    }, [timerFunction]);

    React.useEffect(() => clear, [clear]);

    return React.useMemo(() => {
        const runTimeout = (
            timeoutHandler: CallbackWithCleanup,
            timeoutDurationMs = defaultTimeoutDurationMs
        ): (() => void) => {
            clear();
            timeoutId.current = timerFunction(() => {
                callbackCleanup.current = timeoutHandler();
            }, timeoutDurationMs);
            return clear;
        };

        runTimeout.cancel = clear;

        return runTimeout;
    }, [clear, timerFunction, defaultTimeoutDurationMs]);
}

type TimerFunction = typeof setTimeout | typeof setInterval;

export function useTimeout(defaultTimeoutDurationMs = 0): TimeoutCallback {
    return useTimer(defaultTimeoutDurationMs, setTimeout);
}

export function useInterval(defaultTimeoutDurationMs = 0): TimeoutCallback {
    return useTimer(defaultTimeoutDurationMs, setInterval);
}
