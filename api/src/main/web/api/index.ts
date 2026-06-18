import { apiClientProviderFactory } from './apiClientProviderFactory';

export { apiClientProviderFactory } from './apiClientProviderFactory';
export type { ApiClientProviderFactory, ApiClientProviderProps } from './apiClientProviderFactory';
export type { ApiClient, RequestConfig } from './ApiClient';

export { useRequestQueue, type RequestQueue, type Deferred } from './RequestQueue';

export { useWebSocket, type WebSocketApi } from './useWebSocket';
export { isExpectedApiError, type ApiResultFailure, type ExpectedApiError } from './domain';
export { stringifyQueryParams } from './utils';

export const DefaultApi = apiClientProviderFactory();
