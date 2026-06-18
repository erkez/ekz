import * as React from 'react';

import { useTimeout } from '../timers';

export function useDebouncedEffect(
    timeoutMs: number,
    effect: React.EffectCallback,
    dependencyList?: React.DependencyList
): void {
    const deps = dependencyList || [];
    const timeout = useTimeout(timeoutMs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => timeout(effect), deps);
}
