import { None, Option, Some } from '@ekz/option';
import { DateTime } from 'luxon';

import * as extractors from './extractors';

export type AsyncDataMatch<A, B> = {
    Empty?: () => B;
    Ready?: (value: A) => B;
    Pending?: (startTime: DateTime) => B;
    Failed?: (error: Error) => B;
    PendingStale?: (value: A, startTime: DateTime) => B;
    FailedStale?: (value: A, error: Error) => B;
};

export type AsyncDataState =
    'Empty' | 'Ready' | 'Pending' | 'PendingStale' | 'Failed' | 'FailedStale';

export interface AsyncData<A> {
    readonly value: A;
    readonly error: Error;
    readonly state: AsyncDataState;
    readonly isEmpty: boolean;
    readonly nonEmpty: boolean;
    readonly isPending: boolean;
    readonly isReady: boolean;
    readonly isStale: boolean;
    readonly isFailed: boolean;
    duration(currentTime?: DateTime): Option<number>;
    pending(startTime?: DateTime): AsyncData<A>;
    fail(error: Error): AsyncData<A>;
    ready(value: A): AsyncData<A>;
    map<B>(f: (value: A) => B): AsyncData<B>;
    flatMap<B>(f: (value: A) => AsyncData<B>): AsyncData<B>;
    forEach(f: (value: A) => void): void;
    match<B>(match: AsyncDataMatch<A, B>, getDefault: () => B): B;
    zip<B>(other: AsyncData<B>): AsyncData<[A, B]>;
    toOption(): Option<A>;
}

class $AsyncData<A> implements AsyncData<A> {
    private readonly _value: Option<A>;

    private readonly _error: Option<Error>;

    private readonly _startTime: Option<DateTime>;

    private readonly _state: AsyncDataState;

    constructor(value: Option<A>, error: Option<Error>, startTime: Option<DateTime>) {
        this._value = value;
        this._error = error;
        this._startTime = startTime;
        this._state = this.getState();
    }

    get value(): A {
        if (this._value.isEmpty) {
            throw new Error('Cannot get value when empty');
        }

        return this._value.get();
    }

    get error(): Error {
        if (this._error.isEmpty) {
            throw new Error('Cannot get error when not in failure state');
        }

        return this._error.get();
    }

    get state(): AsyncDataState {
        return this._state;
    }

    get isEmpty(): boolean {
        return this._value.isEmpty;
    }

    get nonEmpty(): boolean {
        return !this.isEmpty;
    }

    get isReady(): boolean {
        return this.nonEmpty && !this.isStale;
    }

    get isPending(): boolean {
        return this._startTime.isDefined;
    }

    get isStale(): boolean {
        return this.nonEmpty && (this.isPending || this._error.isDefined);
    }

    get isFailed(): boolean {
        return this._error.isDefined;
    }

    duration(currentTime: DateTime = DateTime.utc()): Option<number> {
        return this._startTime.map((start) => currentTime.diff(start, 'milliseconds').milliseconds);
    }

    pending(startTime: DateTime = DateTime.utc()): AsyncData<A> {
        return new $AsyncData(this._value, this._error, Some(startTime));
    }

    fail(error: Error): AsyncData<A> {
        return new $AsyncData(this._value, Some(error), None);
    }

    ready(value: A): AsyncData<A> {
        return new $AsyncData(Some(value), None, None);
    }

    map<B>(f: (value: A) => B): AsyncData<B> {
        return this.match(
            {
                Ready: (value) => Ready(f(value)),
                PendingStale: (value, startTime) => Ready(f(value)).pending(startTime),
                FailedStale: (value, error) => Ready(f(value)).fail(error)
            },
            () => new $AsyncData<B>(None, this._error, this._startTime)
        );
    }

    flatMap<B>(f: (value: A) => AsyncData<B>): AsyncData<B> {
        return this.match(
            {
                Ready: (value) => f(value),
                PendingStale: (value) => f(value),
                FailedStale: (value) => f(value)
            },
            () => new $AsyncData<B>(None, this._error, this._startTime)
        );
    }

    forEach(f: (value: A) => void): void {
        this.map(f);
    }

    match<B>(match: AsyncDataMatch<A, B>, getDefault: () => B): B {
        if (this.state === 'Ready' && match.Ready != null) {
            return match.Ready(this.value);
        }

        if (this.state === 'Empty' && match.Empty != null) {
            return match.Empty();
        }

        if (this.state === 'Pending' && match.Pending != null) {
            return match.Pending(this._startTime.get());
        }

        if (this.state === 'PendingStale' && match.PendingStale != null) {
            return match.PendingStale(this.value, this._startTime.get());
        }

        if (this.state === 'Failed' && match.Failed != null) {
            return match.Failed(this.error);
        }

        if (this.state === 'FailedStale' && match.FailedStale != null) {
            return match.FailedStale(this.value, this.error);
        }

        return getDefault();
    }

    zip<B>(other: AsyncData<B>): AsyncData<[A, B]> {
        const otherData = other as $AsyncData<B>;

        const thisStart = this._startTime.map((x) => x.valueOf()).getOrReturn(null);
        const otherStart = otherData._startTime.map((x) => x.valueOf()).getOrReturn(null);

        const startTime = Option.of(
            (thisStart ?? 0) > (otherStart ?? 0) ? thisStart : otherStart
        ).map((millis) => DateTime.fromMillis(millis));

        const error = this._error.isDefined ? this._error : otherData._error;

        const value = this.toOption().flatMap((a) => other.toOption().map((b) => [a, b] as [A, B]));

        return new $AsyncData(value, error, startTime);
    }

    toOption(): Option<A> {
        return this._value;
    }

    private getState(): AsyncDataState {
        if (this.isEmpty && this.isPending) {
            return 'Pending';
        }

        if (this.nonEmpty && this.isPending) {
            return 'PendingStale';
        }

        if (this.isEmpty && this.isFailed && !this.isPending) {
            return 'Failed';
        }

        if (this.nonEmpty && this.isFailed) {
            return 'FailedStale';
        }

        if (this.nonEmpty) {
            return 'Ready';
        }

        return 'Empty';
    }
}

export function Empty<A>(): AsyncData<A> {
    return new $AsyncData(None, None, None);
}

export function Pending<A>(startTime: DateTime = DateTime.utc()): AsyncData<A> {
    return new $AsyncData(None, None, Some(startTime));
}

export function Failed<A>(error: Error): AsyncData<A> {
    return new $AsyncData(None, Some(error), None);
}

export function Ready<A>(value: A): AsyncData<A> {
    return new $AsyncData(Some(value), None, None);
}

export function observePromise<A>(
    promise: Promise<A>,
    updater: (cb: (data: AsyncData<A>) => AsyncData<A>) => void
): () => void {
    updater((state) => state.pending());

    let cancelled = false;
    const unsubscribe = (): void => {
        cancelled = true;
    };

    promise
        .then((data) => {
            if (!cancelled) {
                updater((state) => state.ready(data));
            }

            return null;
        })
        .catch((error: Error) => {
            if (!cancelled) {
                updater((state) => state.fail(error));
            }

            return null;
        });

    return unsubscribe;
}

export function observePromiseGS<A>(
    promise: Promise<A>,
    getState: () => AsyncData<A>,
    setState: (data: AsyncData<A>) => void
): () => void {
    const updater = (update: (data: AsyncData<A>) => AsyncData<A>): void =>
        setState(update(getState()));
    return observePromise(promise, updater);
}

export { extractors };
