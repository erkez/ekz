export interface StorageBackend {
    get(): string | null;
    set(value: string): void;
    delete(): void;
}

abstract class GenericStorageBackend implements StorageBackend {
    protected abstract storage: Storage;

    constructor(private key: string) {}

    get(): string | null {
        return this.storage.getItem(this.key);
    }

    set(value: string): void {
        this.storage.setItem(this.key, value);
    }

    delete(): void {
        this.storage.removeItem(this.key);
    }
}

export class LocalStorageBackend extends GenericStorageBackend {
    protected storage = localStorage;
}

export class SessionStorageBackend extends GenericStorageBackend {
    protected storage = sessionStorage;
}
