import { InputGroup, NumericInput } from '@blueprintjs/core';
import React from 'react';

import type { ColumnDefBase } from './columnHelpers';
import type { Column, Table } from './reactTableBase';

export interface ColumnFilterProps<TData, TValue = unknown> {
    table: Table<TData>;

    column: Column<TData, TValue>;
}

export const ColumnFilter = function ColumnFilter<TData, TValue>(
    props: ColumnFilterProps<TData, TValue>
): React.ReactElement {
    const definition = props.column.columnDef as ColumnDefBase<TData, TValue>;
    const value = props.column.getFilterValue();

    const setFilterValue = props.column.setFilterValue;
    const handleStringChange = React.useCallback(
        (event: React.SyntheticEvent<HTMLInputElement>) =>
            setFilterValue(event.currentTarget.value),
        [setFilterValue]
    );
    const handleNumberChange = React.useCallback(
        (number: number) => setFilterValue([number]),
        [setFilterValue]
    );

    const flatRows = props.table.getPreFilteredRowModel().flatRows;
    const valueType = React.useMemo(
        () =>
            typeof flatRows
                .slice(0, 5)
                .map((row) => row.getValue(props.column.id))
                .filter((x) => x != null)[0],
        [props.column.id, flatRows]
    );

    const numberValue: number | undefined =
        valueType === 'number' && value != null ? (value as [number])[0] : undefined;

    return definition.filter != null ? (
        <>{definition.filter(props)}</>
    ) : valueType === 'number' ? (
        <NumericInput
            asyncControl={true}
            value={value != null ? numberValue : undefined}
            onValueChange={handleNumberChange}
        />
    ) : (
        <InputGroup value={value as string} onChange={handleStringChange} />
    );
};
