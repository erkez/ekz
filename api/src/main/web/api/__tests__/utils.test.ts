import { Map } from 'immutable';

import { stringifyQueryParams } from '../utils';

describe('stringifyQueryParams', () => {
    it('encodes nested objects in bracket notation and omits nulls', () => {
        expect(stringifyQueryParams({ a: { b: 1 }, c: null })).toBe('a%5Bb%5D=1');
    });

    it('omits undefined values and null array items', () => {
        expect(stringifyQueryParams({ a: undefined, b: [1, null, 2], c: 'x y' })).toBe(
            'b=1&b=2&c=x%20y'
        );
    });

    it('keeps nulls as empty values when skipNulls is off', () => {
        expect(stringifyQueryParams({ a: null, b: 1 }, { skipNulls: false })).toBe('a=&b=1');
    });

    it('indexes arrays when asked', () => {
        expect(stringifyQueryParams({ a: [1, 2] }, { indices: true })).toBe(
            'a%5B0%5D=1&a%5B1%5D=2'
        );
    });

    it('serializes immutable collections through toJS', () => {
        expect(stringifyQueryParams(Map({ page: 2, filter: Map({ active: true }) }))).toBe(
            'page=2&filter%5Bactive%5D=true'
        );
    });
});
