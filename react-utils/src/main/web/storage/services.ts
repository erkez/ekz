import { type StorageBackend, LocalStorageBackend, SessionStorageBackend } from './backends';

type ChangeListener<T> = (value: T) => unknown;

type Unsubscribe = () => void;

export class StorageService<T> {
    private changeListeners: Array<ChangeListener<T>> = [];

    constructor(
        private storage: StorageBackend,
        private defaultValue: T,
        private serialize: (value: T) => string | null,
        private deserialize: (value: string) => T
    ) {}

    get(): T {
        const value = this.storage.get();
        if (value == null) {
            return this.defaultValue;
        }
        return this.deserialize(value);
    }

    set(value: T): void {
        const serialized = this.serialize(value);
        if (serialized != null) {
            this.storage.set(serialized);
        } else {
            this.delete();
        }
        this.emitChange();
    }

    update(updater: (value: T) => T): void {
        const value = updater(this.get());
        this.set(value);
        this.emitChange();
    }

    delete(): void {
        this.storage.delete();
        this.emitChange();
    }

    addChangeListener(listener: ChangeListener<T>): Unsubscribe {
        const unsubscribe = (): void => {
            const index = this.changeListeners.indexOf(listener);
            if (index !== -1) {
                this.changeListeners.splice(index, 1);
            }
        };

        if (this.changeListeners.indexOf(listener) === -1) {
            this.changeListeners.push(listener);
            listener(this.get());
        }

        return unsubscribe;
    }

    private emitChange(): void {
        const value = this.get();
        this.changeListeners.forEach((listener) => {
            listener(value);
        });
    }
}

export function fromLocalStorage<T>(
    key: string,
    defaultValue: T,
    serialize: (value: T) => string | null,
    deserialize: (value: string) => T
): StorageService<T> {
    const storageBackend = new LocalStorageBackend(key);
    return new StorageService(storageBackend, defaultValue, serialize, deserialize);
}

export function fromSessionStorage<T>(
    key: string,
    defaultValue: T,
    serialize: (value: T) => string | null,
    deserialize: (value: string) => T
): StorageService<T> {
    const storageBackend = new SessionStorageBackend(key);
    return new StorageService(storageBackend, defaultValue, serialize, deserialize);
}
