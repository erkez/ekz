import React from 'react';
import { useLocation } from '@docusaurus/router';

import { ekzDocPackages } from '../../packages';

function detectPackage(pathname: string): string | undefined {
    for (const pkg of ekzDocPackages) {
        const base = `/${pkg.routeBasePath}`;
        if (pathname === base || pathname.startsWith(`${base}/`)) {
            return pkg.id;
        }
    }

    return undefined;
}

export default function Root({ children }: { children: React.ReactNode }): React.JSX.Element {
    const { pathname } = useLocation();

    React.useEffect(() => {
        const pkg = detectPackage(pathname);

        if (pkg != null) {
            document.documentElement.dataset.ekzPackage = pkg;
        } else {
            delete document.documentElement.dataset.ekzPackage;
        }
    }, [pathname]);

    return <>{children}</>;
}
