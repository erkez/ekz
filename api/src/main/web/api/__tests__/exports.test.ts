import { ExpectedApiError, isExpectedApiError } from '..';

describe('package exports', () => {
    it('exports ExpectedApiError as a constructible class', () => {
        const error = new ExpectedApiError({ message: 'Name is taken', status: false });

        expect(isExpectedApiError(error)).toBe(true);
        expect(error.reason).toBe('Name is taken');
    });
});
