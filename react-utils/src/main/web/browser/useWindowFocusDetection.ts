import * as React from 'react';

export function useWindowFocusDetection(): boolean {
    const [isVisible, setVisible] = React.useState(!document.hidden);

    const visibilityChangeHandler = React.useCallback(() => {
        setVisible(!document.hidden);
    }, []);

    React.useEffect(() => {
        document.addEventListener('visibilitychange', visibilityChangeHandler);
        return () => document.removeEventListener('visibilitychange', visibilityChangeHandler);
    }, [visibilityChangeHandler]);

    return isVisible;
}
