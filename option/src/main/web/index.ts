const PrivateToken = Symbol('Option');

export class Option<A> {
    constructor($privateToken: typeof PrivateToken) {
        if ($privateToken !== PrivateToken) {
            throw new Error('Option cannot be manually instantiated. Use Option.of, Some or None.');
        }
    }

    get isDefined(): boolean {
        return !this.isEmpty;
    }

    get(): A {
        throw new Error('Not implemented');
    }

    get isEmpty(): boolean {
        throw new Error('Not implemented');
    }

    map<B>(f: (value: A) => B): Option<B> {
        return this.isEmpty ? None : Some(f(this.get()));
    }

    mapNullable<B>(f: (value: A) => B | null | undefined): Option<B> {
        return this.isEmpty ? None : Option.of(f(this.get()));
    }

    flatMap<B>(f: (value: A) => Option<B>): Option<B> {
        return this.isEmpty ? None : f(this.get());
    }

    forEach(f: (value: A) => void): void {
        if (!this.isEmpty) {
            f(this.get());
        }
    }

    filter(predicate: (value: A) => boolean): Option<A> {
        return this.isEmpty || predicate(this.get()) ? this : None;
    }

    getOrElse<B>(other: () => B): A | B {
        return this.isEmpty ? other() : this.get();
    }

    getOrReturn<B>(other: B): A | B {
        return this.isEmpty ? other : this.get();
    }

    getOrUndefined(): A | undefined {
        return this.isEmpty ? undefined : this.get();
    }

    equals(other: Option<A>): boolean {
        return this.isDefined && other.isDefined ? this.get() === other.get() : this === other;
    }

    toJSON(): unknown {
        const value = this.getOrReturn(null);

        if (
            value != null &&
            typeof (value as unknown as { toJSON?: () => unknown }).toJSON === 'function'
        ) {
            return (value as unknown as { toJSON: () => unknown }).toJSON();
        }

        return value;
    }

    static of<V>(value?: V | null | void): Option<V> {
        return value == null ? None : Some(value);
    }

    static None: Option<never>;

    static Some: <T>(value: T) => Option<T>;
}

class $None extends Option<never> {
    get(): never {
        throw new Error('No such element');
    }

    override get isEmpty(): boolean {
        return true;
    }
}

export const None: Option<never> = new $None(PrivateToken);

Option.None = None;

class $Some<T> extends Option<T> {
    private readonly _value: T;

    constructor(value: T) {
        super(PrivateToken);
        this._value = value;
    }

    get(): T {
        return this._value;
    }

    override get isEmpty(): boolean {
        return false;
    }
}

export function Some<T>(value: T): Option<T> {
    return new $Some(value);
}

Option.Some = Some;
