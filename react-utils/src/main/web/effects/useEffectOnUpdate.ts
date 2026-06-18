import * as React from 'react';

export function useEffectOnUpdate(effect: React.EffectCallback, deps?: React.DependencyList): void {
    const hasMounted = React.useRef(false);

    React.useEffect(() => {
        if (hasMounted.current) {
            return effect();
        }

        hasMounted.current = true;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
