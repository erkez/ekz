import * as React from 'react';

import { StorageService, fromLocalStorage, fromSessionStorage } from './services';

export { StorageService };
export type { StorageBackend } from './backends';

export interface StoredValue<T> {
    value: T;
    set(value: T): void;
    update: React.Dispatch<React.SetStateAction<T>>;
    delete(): void;
}

export interface StoredValueConfig<T> {
    defaultValue: T;
    serialize: (value: T) => string | null;
    deserialize: (value: string) => T;
}

export function useLocalStorage<T>(name: string, config: StoredValueConfig<T>): StoredValue<T> {
    const service = React.useMemo(
        () => fromLocalStorage(name, config.defaultValue, config.serialize, config.deserialize),
        [name, config.defaultValue, config.serialize, config.deserialize]
    );

    return useStoredValue(service);
}

export function useSessionStorage<T>(name: string, config: StoredValueConfig<T>): StoredValue<T> {
    const service = React.useMemo(
        () => fromSessionStorage(name, config.defaultValue, config.serialize, config.deserialize),
        [name, config.defaultValue, config.serialize, config.deserialize]
    );

    return useStoredValue(service);
}

export function useStoredValue<T>(service: StorageService<T>): StoredValue<T> {
    const [value, setValue] = React.useState<T>(service.get());

    React.useEffect(() => service.addChangeListener(setValue), [service]);

    const set = React.useCallback(
        (value: T) => {
            service.set(value);
        },
        [service]
    );

    const updateValue = React.useCallback(
        (updater: React.SetStateAction<T>) => {
            return typeof updater === 'function'
                ? service.update(updater as (value: T) => T)
                : service.set(updater);
        },
        [service]
    );

    const deleteValue = React.useCallback(() => {
        service.delete();
    }, [service]);

    return React.useMemo(() => {
        return { value, set, update: updateValue, delete: deleteValue };
    }, [value, set, deleteValue, updateValue]);
}
