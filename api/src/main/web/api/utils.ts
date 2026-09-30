import qs from 'qs';

const QueryStringDefaultOptions = {
    skipNulls: true,
    indices: false
};

interface QueryStringifyOptions {
    skipNulls?: boolean;
    indices?: boolean;
}

type QueryParamsRecord = Record<string, unknown>;

export function stringifyQueryParams(params: unknown, options?: QueryStringifyOptions): string {
    const mergedOptions = { ...QueryStringDefaultOptions, ...options };
    const paramsAsObject =
        typeof params === 'object' &&
        params != null &&
        'toJS' in params &&
        typeof params.toJS === 'function'
            ? (params.toJS() as QueryParamsRecord)
            : (params as QueryParamsRecord);
    return qs.stringify(paramsAsObject, mergedOptions);
}
