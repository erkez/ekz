import { default as Axios, AxiosError } from 'axios';
import type { AxiosResponse, Method, ResponseType, AxiosInstance } from 'axios';
import Bluebird from 'bluebird';

import { ExpectedApiError, type ApiResultFailure } from './domain';
import { stringifyQueryParams } from './utils';

export interface RequestConfig<Body> {
    readonly query?: Record<string, unknown>;
    readonly headers?: Record<string, unknown>;
    body?: Body;
    responseType?: ResponseType;
    skipAuthentication?: boolean;
    retryAttempts?: number;
    retryNumber?: number;
}

export interface ApiClient {
    readonly baseUrl: string;
    get<B>(url: string, config?: RequestConfig<void>): Bluebird<AxiosResponse<B>>;
    post<B>(url: string, config?: RequestConfig<unknown>): Bluebird<AxiosResponse<B>>;
    put<B>(url: string, config?: RequestConfig<unknown>): Bluebird<AxiosResponse<B>>;
    patch<B>(url: string, config?: RequestConfig<unknown>): Bluebird<AxiosResponse<B>>;
    delete<B>(url: string, config?: RequestConfig<unknown>): Bluebird<AxiosResponse<B>>;
    execute<B>(
        method: Method,
        url: string,
        config?: RequestConfig<unknown>
    ): Bluebird<AxiosResponse<B>>;
}

export interface ApiClientOptions {
    unauthorizedRedirectPath?: string;
    unauthorizedStatus?: ReadonlyArray<number>;
}

export function createApiClient(baseUrl: string, options: ApiClientOptions = {}): ApiClient {
    const axios: AxiosInstance = Axios.create();

    const unauthorizedStatus = new Set(options.unauthorizedStatus);

    function performRequest<B, R>(
        url: string,
        method: Method,
        config: RequestConfig<B>
    ): Bluebird<AxiosResponse<R>> {
        const cancelTokenSource = Axios.CancelToken.source();

        const request = Bluebird.resolve()
            .delay(10)
            .then(() =>
                axios({
                    url,
                    baseURL: baseUrl,
                    method,
                    params: config.query != null ? config.query : {},
                    paramsSerializer: (params) => stringifyQueryParams(params),
                    responseType: config.responseType || 'json',
                    data: config.body,
                    withCredentials: true,
                    cancelToken: cancelTokenSource.token
                })
            );

        return request
            .catch((error: AxiosError<R>) => {
                if (
                    !config.skipAuthentication &&
                    unauthorizedStatus.has(error.response?.status ?? 0)
                ) {
                    window.location.href = options.unauthorizedRedirectPath || '';
                }

                throw error;
            })
            .catch((error: AxiosError<R>) => {
                const retryAttempts = config.retryAttempts ?? 3;
                const retryNumber = config.retryNumber ?? 0;
                const backoffMs = Math.min(500 * Math.pow(2, retryNumber), 30000);
                const errorStatus = error.response?.status;
                const shouldRetry = errorStatus === 504 || error.name === 'Network Error';

                if (shouldRetry && retryAttempts > 0) {
                    return Bluebird.delay(backoffMs).then(() =>
                        performRequest<B, R>(url, method, {
                            ...config,
                            retryAttempts: retryAttempts - 1,
                            retryNumber: retryNumber + 1
                        })
                    );
                }

                if (errorStatus && errorStatus >= 400 && errorStatus < 500) {
                    const data = error.response?.data as Partial<ApiResultFailure> | undefined;
                    throw new ExpectedApiError(
                        data?.message
                            ? (data as ApiResultFailure)
                            : { message: 'API request failed', status: false }
                    );
                }

                throw error;
            })
            .finally(() => {
                if (request.isCancelled()) {
                    cancelTokenSource.cancel();
                }
            });
    }

    return {
        baseUrl,
        get: (url, config = {}) => performRequest(url, 'GET', config),
        post: (url, config = {}) => performRequest(url, 'POST', config),
        put: (url, config = {}) => performRequest(url, 'PUT', config),
        patch: (url, config = {}) => performRequest(url, 'PATCH', config),
        delete: (url, config = {}) => performRequest(url, 'DELETE', config),
        execute: (method, url, config = {}) => performRequest(url, method, config)
    };
}
