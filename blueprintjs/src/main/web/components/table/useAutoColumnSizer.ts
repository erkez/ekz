import * as React from 'react';

import type { Table } from './reactTableBase';
import { TableTheme } from './theme';

export const CELL_PADDING = 20;
export const CELL_BORDER = 1;

export function useAutoColumnSizer(
    ref: HTMLDivElement | null,
    table: Table<unknown>,
    theme: TableTheme | undefined
): { recalculate: () => void } {
    const visibleFlatColumns = table.getVisibleFlatColumns();
    const setColumnSizing = table.setColumnSizing;

    const recalculate = React.useCallback(() => {
        const availableWidth =
            (ref?.clientWidth ?? 0) -
            visibleFlatColumns.length * CELL_PADDING - // cell padding
            (visibleFlatColumns.length - CELL_BORDER) - // cell border
            (theme === TableTheme.Segment ? 40 : 0); // theme padding

        if (availableWidth > 0) {
            const { autoColumns, totalFixedSize } = visibleFlatColumns.reduce<{
                autoColumns: string[];
                totalFixedSize: number;
            }>(
                (result, column) => {
                    if (column.columnDef.size === -1) {
                        return {
                            ...result,
                            autoColumns: [...result.autoColumns, column.id]
                        };
                    } else {
                        return {
                            ...result,
                            totalFixedSize: result.totalFixedSize + (column.columnDef.size ?? 0)
                        };
                    }
                },
                {
                    autoColumns: [],
                    totalFixedSize: 0
                }
            );

            if (autoColumns.length > 0) {
                const remainingWidthPerColumn = Math.max(
                    (availableWidth - totalFixedSize) / autoColumns.length,
                    150
                );
                const sizing = autoColumns.reduce(
                    (sizeByColumn, columnId) => ({
                        ...sizeByColumn,
                        [columnId]: remainingWidthPerColumn
                    }),
                    {}
                );
                setColumnSizing((previousSizing) => ({ ...previousSizing, ...sizing }));
            }
        }
    }, [visibleFlatColumns, setColumnSizing, theme, ref]);

    React.useEffect(() => {
        recalculate();
    }, [recalculate, visibleFlatColumns, ref?.clientWidth]);

    return { recalculate };
}
