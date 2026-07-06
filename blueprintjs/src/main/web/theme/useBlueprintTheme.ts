import { useLayoutEffect } from 'react';

import { applyBlueprintTheme } from './blueprintTheme';
import type { BlueprintTheme } from './blueprintTheme';

export function useBlueprintTheme(theme: BlueprintTheme): void {
    useLayoutEffect(() => {
        applyBlueprintTheme(theme);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(theme)]);
}
