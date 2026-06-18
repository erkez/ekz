import qs from 'querystring';

const QueryStringDefaultOptions = {
    skipNulls: true,
    indices: false
};

export function stringifyQueryParams(params: unknown, options?: qs.StringifyOptions): string {
    const mergedOptions = { ...QueryStringDefaultOptions, ...options };
    const paramsAsObject =
        typeof params === 'object' &&
        params != null &&
        'toJS' in params &&
        typeof params.toJS === 'function'
            ? (params.toJS() as qs.ParsedUrlQueryInput)
            : (params as qs.ParsedUrlQueryInput);
    return qs.stringify(paramsAsObject, undefined, undefined, mergedOptions);
}
