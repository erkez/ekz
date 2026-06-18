import { DateTime } from 'luxon';
import * as React from 'react';

export interface Clock {
    readonly now: DateTime;
    /**
     * Updates the current time in the given interval.
     * @param intervalMs Interval for clock update in milliseconds. Defaults to 1000ms.
     */
    tick(intervalMs?: number): () => void;
    update(): void;
}

export const useClock = function useClock(tickIntervalMs?: number, locale?: string): Clock {
    const getCurrentTime = React.useCallback(
        () => (locale != null ? DateTime.utc().setLocale(locale) : DateTime.utc()),
        [locale]
    );

    const [now, setNow] = React.useState(getCurrentTime);

    const update = React.useCallback(() => setNow(getCurrentTime()), [getCurrentTime]);

    const tick = React.useCallback(
        (intervalMs = 1000) => {
            const interval = setInterval(update, intervalMs);
            return () => clearInterval(interval);
        },
        [update]
    );

    React.useEffect(() => {
        if (tickIntervalMs != null && tickIntervalMs > 0) {
            return tick(tickIntervalMs);
        }
    }, [tick, tickIntervalMs]);

    return React.useMemo(() => ({ now, tick, update }), [now, tick, update]);
};
