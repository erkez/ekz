import { default as Axios, AxiosError } from 'axios';
import type {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    Method,
    RawAxiosRequestHeaders,
    ResponseType
} from 'axios';
import Bluebird from 'bluebird';

import { ExpectedApiError, type ApiResultFailure } from './domain';
import { stringifyQueryParams } from './utils';

export interface RequestConfig<Body> {
    readonly query?: Record<string, unknown>;
    readonly headers?: RawAxiosRequestHeaders;
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

export type RequestHook = (
    config: AxiosRequestConfig
) => AxiosRequestConfig | PromiseLike<AxiosRequestConfig>;

export type UnauthorizedHandler = (
    error: AxiosError,
    retry: () => Bluebird<AxiosResponse>
) => PromiseLike<AxiosResponse> | void;

export interface ApiClientOptions {
    unauthorizedRedirectPath?: string;
    unauthorizedStatus?: ReadonlyArray<number>;
    onRequest?: RequestHook;
    onUnauthorized?: UnauthorizedHandler;
    withCredentials?: boolean;
}

const IdempotentMethods: ReadonlySet<string> = new Set(['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE']);

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
            .then(() => {
                const axiosConfig: AxiosRequestConfig = {
                    url,
                    baseURL: baseUrl,
                    method,
                    headers: config.headers,
                    params: config.query != null ? config.query : {},
                    paramsSerializer: (params) => stringifyQueryParams(params),
                    responseType: config.responseType || 'json',
                    data: config.body,
                    withCredentials: options.withCredentials ?? true,
                    cancelToken: cancelTokenSource.token
                };
                return options.onRequest != null ? options.onRequest(axiosConfig) : axiosConfig;
            })
            .then((axiosConfig) => axios(axiosConfig));

        return request
            .catch((error: AxiosError<R>) => {
                const errorStatus = error.response?.status;

                if (!config.skipAuthentication && unauthorizedStatus.has(errorStatus ?? 0)) {
                    if (options.onUnauthorized != null) {
                        let retried: Bluebird<AxiosResponse<R>> | undefined;
                        const retry = (): Bluebird<AxiosResponse<R>> =>
                            (retried ??= performRequest<B, R>(url, method, {
                                ...config,
                                skipAuthentication: true
                            }));
                        const handled = options.onUnauthorized(error, retry);

                        if (handled != null) {
                            return handled as PromiseLike<AxiosResponse<R>>;
                        }
                    } else {
                        window.location.href = options.unauthorizedRedirectPath || '';
                    }
                }

                const retryAttempts =
                    config.retryAttempts ?? (IdempotentMethods.has(method.toUpperCase()) ? 3 : 0);
                const retryNumber = config.retryNumber ?? 0;
                const backoffMs = Math.min(500 * Math.pow(2, retryNumber), 30000);
                const shouldRetry = errorStatus === 504 || error.code === AxiosError.ERR_NETWORK;

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
