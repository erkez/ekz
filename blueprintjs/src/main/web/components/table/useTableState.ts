import { type Dispatch, type SetStateAction, useState } from 'react';

import type { Table, TableState } from './reactTableBase';

export function useTableState<T>(
    table: Table<T>
): [TableState, Dispatch<SetStateAction<TableState>>] {
    const state = useState(table.initialState);
    table.setOptions((previous) => ({
        ...previous,
        onStateChange: state[1],
        state: state[0]
    }));
    return state;
}
