export interface ApiResultFailure {
    message: string;
    status: boolean;
}

export class ExpectedApiError extends Error {
    reason?: string;
    failure?: ApiResultFailure;

    constructor(failure?: ApiResultFailure) {
        super(failure?.message ?? 'Unexpected API error');
        this.name = 'ExpectedApiError';
        this.reason = failure?.message;
        this.failure = failure;

        Object.setPrototypeOf(this, ExpectedApiError.prototype);
    }
}

export function isExpectedApiError(value: unknown): value is ExpectedApiError {
    return value instanceof ExpectedApiError;
}
