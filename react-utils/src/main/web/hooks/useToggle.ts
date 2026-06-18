import * as React from 'react';

export interface ToggleApi {
    isEnabled: boolean;
    onEnable(): void;
    onDisable(): void;
    onToggle(): void;
    setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useToggle(initialOpen = false): ToggleApi {
    const [isEnabled, setEnabled] = React.useState(initialOpen);

    const onEnable = React.useCallback(() => setEnabled(true), []);
    const onDisable = React.useCallback(() => setEnabled(false), []);
    const onToggle = React.useCallback(() => setEnabled((isEnabled) => !isEnabled), []);

    return React.useMemo(
        () => ({ isEnabled, onEnable, onDisable, onToggle, setEnabled }),
        [isEnabled, onEnable, onDisable, onToggle]
    );
}
