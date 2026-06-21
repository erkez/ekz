import invariant from 'invariant';
import * as React from 'react';

import type { Table } from './reactTableBase';
import type { TableTheme } from './theme';

export function useAutoHeight(
    autoHeight: [minPageSize: number, maxPageSize: number] | undefined,
    autoHeightParentHeight: number | undefined,
    autoHeightMaxHeight: number | undefined,
    autoHeightAverageRowHeight: number | undefined,
    autoHeightObserveRows: boolean | undefined,
    theme: TableTheme | undefined,
    table: Table<unknown>,
    ref: HTMLDivElement | null,
    bodyRef: React.RefObject<HTMLDivElement>,
    nonIdealStateRef: React.RefObject<HTMLDivElement>
): (entries: ResizeObserverEntry[]) => void {
    const visibleRowCount = table.getRowModel().rows.length ?? 0;

    const [minPageSize, maxPageSize] = autoHeight ?? [0, 0];

    invariant(
        autoHeight == null || maxPageSize > minPageSize,
        'maxPageSize must be greater than minPageSize'
    );
    invariant(autoHeight == null || minPageSize > 0, 'minPageSize must be greater than 0');
    invariant(autoHeight == null || maxPageSize > 1, 'maxPageSize must be greater than 0');

    const calculatePageSize = React.useCallback(() => {
        if (minPageSize > 0 && maxPageSize > 0) {
            const parentHeight = Math.min(
                autoHeightParentHeight ?? ref?.parentElement?.clientHeight ?? 0,
                autoHeightMaxHeight ?? Number.MAX_VALUE
            );
            const tableHeight = ref?.clientHeight ?? 0;
            const bodyHeight =
                bodyRef.current?.clientHeight ?? nonIdealStateRef.current?.clientHeight ?? 0;
            const hasPagination = table.getPageCount() > 1;
            const averageRowHeight =
                autoHeightAverageRowHeight ??
                (visibleRowCount > 0 ? bodyHeight / visibleRowCount : 40);

            const nonBodyTotalSize = tableHeight - bodyHeight + (hasPagination ? 0 : 54); // fixed footer height (pagination)
            const pageSize = Math.min(
                Math.max((parentHeight - nonBodyTotalSize) / averageRowHeight, minPageSize),
                maxPageSize
            );
            if (table.options.debugTable) {
                console.log('Calculating page size', {
                    averageRowHeight,
                    bodyHeight,
                    maxPageSize,
                    minPageSize,
                    pageSize,
                    parentHeight,
                    tableHeight,
                    visibleRowCount
                });
            }
            table.setPageSize(Math.floor(pageSize));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        ref,
        minPageSize,
        maxPageSize,
        autoHeightParentHeight,
        autoHeightMaxHeight,
        autoHeightAverageRowHeight,
        visibleRowCount,
        theme,
        table
    ]);

    React.useEffect(() => calculatePageSize(), [calculatePageSize]);

    const handleResize = React.useCallback(
        (entries: ResizeObserverEntry[]) => {
            if (entries.length > 0) {
                if (entries[0].target !== ref) {
                    calculatePageSize();
                }
            }
        },
        [ref, calculatePageSize]
    );

    const bodyRefCurrent = bodyRef.current;
    React.useEffect((): void | (() => void) => {
        if (autoHeightObserveRows && autoHeight != null && bodyRefCurrent != null) {
            const observer = new ResizeObserver(() => {
                calculatePageSize();
            });
            observer.observe(bodyRefCurrent);
            return () => observer.disconnect();
        }
    }, [autoHeightObserveRows, autoHeight, bodyRefCurrent, calculatePageSize]);

    return handleResize;
}
