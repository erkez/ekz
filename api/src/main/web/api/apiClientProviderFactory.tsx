import invariant from 'invariant';
import * as React from 'react';

import type { ApiClient, ApiClientOptions } from './ApiClient';
import { createApiClient } from './ApiClient';

export interface ApiClientProviderProps extends ApiClientOptions {
    baseUrl: string;
    children: React.ReactNode;
}

export interface ApiClientProviderFactory {
    readonly ApiClientProvider: React.ComponentType<ApiClientProviderProps>;
    useApiClient(): ApiClient;
}

export function apiClientProviderFactory(): ApiClientProviderFactory {
    const Context = React.createContext<ApiClient>({
        baseUrl: '',
        get: noop,
        post: noop,
        put: noop,
        patch: noop,
        delete: noop,
        execute: noop
    });

    function ApiClientProvider(props: ApiClientProviderProps): React.ReactElement {
        const apiClientOptions = React.useMemo((): ApiClientOptions => {
            return {
                unauthorizedRedirectPath: props.unauthorizedRedirectPath ?? '/',
                unauthorizedStatus: props.unauthorizedStatus ?? [401],
                onRequest: props.onRequest,
                onUnauthorized: props.onUnauthorized,
                withCredentials: props.withCredentials
            };
        }, [
            props.unauthorizedRedirectPath,
            props.unauthorizedStatus,
            props.onRequest,
            props.onUnauthorized,
            props.withCredentials
        ]);

        const apiClient = React.useMemo(() => {
            return createApiClient(props.baseUrl, apiClientOptions);
        }, [props.baseUrl, apiClientOptions]);

        return <Context.Provider value={apiClient}>{props.children}</Context.Provider>;
    }

    function useApiClient(): ApiClient {
        return React.useContext(Context);
    }

    return { ApiClientProvider, useApiClient };
}

function noop(): never {
    invariant(false, 'Cannot call method on empty context. Did you forget to mount the provider?');
}
