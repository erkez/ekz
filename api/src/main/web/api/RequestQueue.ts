import Bluebird from 'bluebird';
import { List, Set } from 'immutable';
import * as React from 'react';

export class RequestQueue<T> {
    private queue: List<[Deferred<T>, () => Bluebird<T>]>;
    private outstanding: Set<Deferred<T>>;

    constructor(private paralellism: number) {
        this.queue = List<[Deferred<T>, () => Bluebird<T>]>().asMutable();
        this.outstanding = Set<Deferred<T>>().asMutable();
    }

    public enqueue(fn: () => Bluebird<T>): Bluebird<T> {
        const deferred = defer<T>();
        this.queue.push([deferred, fn]);
        this.processQueue();
        return deferred.promise;
    }

    private processQueue(): void {
        if (this.outstanding.size < this.paralellism && this.queue.size > 0) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const [deferred, factory] = this.queue.get(0)!;
            this.queue.shift();

            this.outstanding.add(deferred);
            factory()
                .then((value) => {
                    deferred.resolve(value);
                    return null;
                })
                .catch((error) => {
                    deferred.reject(error);
                    return null;
                })
                .finally(() => {
                    this.outstanding.remove(deferred);
                    this.processQueue();
                });
        }
    }
}

export interface Deferred<T> {
    resolve(value: T): void;
    reject(error: Error): void;
    promise: Bluebird<T>;
}

function defer<T>(): Deferred<T> {
    let _resolve: (value: T) => void;
    let _reject: (error: Error) => void;

    const promise = new Bluebird<T>((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
    });

    return {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resolve: _resolve,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        reject: _reject,
        promise
    };
}

export function useRequestQueue<T>(paralellism = 5): RequestQueue<T> {
    return React.useMemo(() => new RequestQueue<T>(paralellism), [paralellism]);
}
