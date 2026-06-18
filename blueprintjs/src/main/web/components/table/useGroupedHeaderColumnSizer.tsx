import React from 'react';

import type { Header, Table, TableState } from './reactTableBase';
import { CELL_BORDER, CELL_PADDING } from './useAutoColumnSizer';

export function useGroupedHeaderColumnSizer(
    table: Table<unknown>,
    tableState: TableState
): Record<string, number> {
    const columnSize = table.getVisibleFlatColumns().length;
    const tableColumnOrder = table.getState().columnOrder;
    const tableColumnVisibility = table.getState().columnVisibility;
    const { columnSizing, columnSizingInfo } = tableState;
    return React.useMemo(() => {
        return table.getHeaderGroups().reduce<Record<string, number>>(
            (vars, group) =>
                group.headers.reduce<Record<string, number>>((result, header) => {
                    const isGroupHeader = !header.isPlaceholder && header.subHeaders?.length > 0;

                    if (!isGroupHeader) return result;

                    result[`--header-${header.id}-size`] = getSpanSizeFromSizing(
                        header,
                        tableState.columnSizing,
                        CELL_PADDING + CELL_BORDER
                    );

                    return result;
                }, vars),
            {}
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        table,
        columnSize,
        columnSizing,
        columnSizingInfo,
        tableColumnOrder,
        tableColumnVisibility
    ]);
}

type SpanMetrics = { leafSum: number; leafCount: number };

function getSpanMetricsFromSizing(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    header: Header<any, any>,
    sizing: Record<string, number | undefined>
): SpanMetrics {
    if (!header.subHeaders?.length) {
        const id = header.column.id;
        return {
            leafCount: 1,
            leafSum: sizing[id] ?? header.getSize()
        };
    }

    return header.subHeaders.reduce<SpanMetrics>(
        (acc, sub) => {
            const m = getSpanMetricsFromSizing(sub, sizing);
            return {
                leafCount: acc.leafCount + m.leafCount,
                leafSum: acc.leafSum + m.leafSum
            };
        },
        { leafSum: 0, leafCount: 0 }
    );
}

function getSpanSizeFromSizing(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    header: Header<any, any>,
    sizing: Record<string, number | undefined>,
    betweenLeavesPx: number
): number {
    if (header.isPlaceholder) return header.getSize();

    const { leafSum, leafCount } = getSpanMetricsFromSizing(header, sizing);
    const between = Math.max(0, leafCount - 1) * betweenLeavesPx;
    return leafSum + between;
}
