import Axios, { AxiosError } from 'axios';
import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { createApiClient, type ApiClient, type ApiClientOptions } from '../ApiClient';
import { ExpectedApiError } from '../domain';

type Reply = { status: number; data?: unknown } | 'network';

const createInstance = Axios.create;

interface Harness {
    calls: InternalAxiosRequestConfig[];
    api: ApiClient;
}

function setup(replies: Reply[], options?: ApiClientOptions): Harness {
    const calls: InternalAxiosRequestConfig[] = [];
    const adapter: AxiosAdapter = (config) => {
        calls.push(config);
        const reply = replies.shift() ?? { status: 200, data: {} };

        if (reply === 'network') {
            return Promise.reject(
                new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, {})
            );
        }

        const response: AxiosResponse = {
            status: reply.status,
            statusText: '',
            data: reply.data,
            headers: {},
            config
        };

        if (reply.status < 400) {
            return Promise.resolve(response);
        }

        return Promise.reject(
            new AxiosError(
                'Request failed',
                reply.status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
                config,
                {},
                response
            )
        );
    };
    jest.spyOn(Axios, 'create').mockImplementation((config) =>
        createInstance({ ...config, adapter })
    );
    return { calls, api: createApiClient('https://api.test', options) };
}

const fakeWindow = { location: { href: '' } };

beforeEach(() => {
    fakeWindow.location.href = '';
    (globalThis as { window?: unknown }).window = fakeWindow;
});

afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
    jest.restoreAllMocks();
});

describe('request config', () => {
    it('sends the request headers', async () => {
        const { api, calls } = setup([]);
        await api.get('/x', { headers: { 'X-Custom': 'value' } });
        expect(calls[0].headers.get('X-Custom')).toBe('value');
    });

    it('sends credentials unless the client opts out', async () => {
        const withDefault = setup([]);
        await withDefault.api.get('/x');
        expect(withDefault.calls[0].withCredentials).toBe(true);

        const withoutCredentials = setup([], { withCredentials: false });
        await withoutCredentials.api.get('/x');
        expect(withoutCredentials.calls[0].withCredentials).toBe(false);
    });

    it('runs onRequest before every attempt and sends what it returns', async () => {
        let attempt = 0;
        const { api, calls } = setup([{ status: 504 }, { status: 200 }], {
            onRequest: (config) => ({
                ...config,
                headers: { ...config.headers, Authorization: `Bearer ${++attempt}` }
            })
        });
        await api.get('/x', { retryAttempts: 1 });
        expect(calls.map((call) => call.headers.get('Authorization'))).toEqual([
            'Bearer 1',
            'Bearer 2'
        ]);
    });
});

describe('unauthorized handling', () => {
    const unauthorized = { unauthorizedStatus: [401], unauthorizedRedirectPath: '/login' };

    it('redirects when no handler is set', async () => {
        const { api } = setup([{ status: 401 }], unauthorized);
        await expect(api.get('/x')).rejects.toBeInstanceOf(ExpectedApiError);
        expect(fakeWindow.location.href).toBe('/login');
    });

    it('resolves with the retried response when the handler retries', async () => {
        const onUnauthorized = jest.fn((_error: AxiosError, retry: () => PromiseLike<unknown>) =>
            retry()
        );
        const { api, calls } = setup([{ status: 401 }, { status: 200, data: { ok: true } }], {
            ...unauthorized,
            onUnauthorized: onUnauthorized as ApiClientOptions['onUnauthorized']
        });
        const response = await api.get<{ ok: boolean }>('/x');
        expect(response.data).toEqual({ ok: true });
        expect(calls).toHaveLength(2);
        expect(onUnauthorized).toHaveBeenCalledTimes(1);
        expect(fakeWindow.location.href).toBe('');
    });

    it('propagates the refusal when the retry is also refused', async () => {
        const onUnauthorized = jest.fn((_error: AxiosError, retry: () => PromiseLike<unknown>) =>
            retry()
        );
        const { api, calls } = setup([{ status: 401 }, { status: 401 }], {
            ...unauthorized,
            onUnauthorized: onUnauthorized as ApiClientOptions['onUnauthorized']
        });
        await expect(api.get('/x')).rejects.toBeInstanceOf(ExpectedApiError);
        expect(calls).toHaveLength(2);
        expect(onUnauthorized).toHaveBeenCalledTimes(1);
        expect(fakeWindow.location.href).toBe('');
    });

    it('issues one retry however often retry() is called', async () => {
        const { api, calls } = setup([{ status: 401 }, { status: 200 }], {
            ...unauthorized,
            onUnauthorized: (_error, retry) => {
                const first = retry();
                expect(retry()).toBe(first);
                return first;
            }
        });
        await api.get('/x');
        expect(calls).toHaveLength(2);
    });

    it('propagates the error when the handler does not retry', async () => {
        const { api, calls } = setup([{ status: 401 }], {
            ...unauthorized,
            onUnauthorized: () => undefined
        });
        await expect(api.get('/x')).rejects.toBeInstanceOf(ExpectedApiError);
        expect(calls).toHaveLength(1);
        expect(fakeWindow.location.href).toBe('');
    });

    it('skips the handler when the request skips authentication', async () => {
        const onUnauthorized = jest.fn();
        const { api } = setup([{ status: 401 }], { ...unauthorized, onUnauthorized });
        await expect(api.get('/x', { skipAuthentication: true })).rejects.toBeInstanceOf(
            ExpectedApiError
        );
        expect(onUnauthorized).not.toHaveBeenCalled();
        expect(fakeWindow.location.href).toBe('');
    });
});

describe('retry on 504 or network error', () => {
    it('retries an idempotent method on 504', async () => {
        const { api, calls } = setup([{ status: 504 }, { status: 200 }]);
        await api.get('/x', { retryAttempts: 1 });
        expect(calls).toHaveLength(2);
    });

    it('retries an idempotent method on a network error', async () => {
        const { api, calls } = setup(['network', { status: 200 }]);
        await api.get('/x', { retryAttempts: 1 });
        expect(calls).toHaveLength(2);
    });

    it('does not retry post on a network error by default', async () => {
        const { api, calls } = setup(['network']);
        await expect(api.post('/x', { body: {} })).rejects.toBeInstanceOf(AxiosError);
        expect(calls).toHaveLength(1);
    });

    it.each(['post', 'patch'] as const)('does not retry %s by default', async (method) => {
        const { api, calls } = setup([{ status: 504 }]);
        await expect(api[method]('/x', { body: {} })).rejects.toBeInstanceOf(AxiosError);
        expect(calls).toHaveLength(1);
    });

    it('retries a non-idempotent method when the request asks for it', async () => {
        const { api, calls } = setup([{ status: 504 }, { status: 200 }]);
        await api.post('/x', { body: {}, retryAttempts: 1 });
        expect(calls).toHaveLength(2);
    });
});
