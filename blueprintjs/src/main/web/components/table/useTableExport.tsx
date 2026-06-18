import * as React from 'react';

import type { Table as TableAPI } from './reactTableBase';

export interface TableExport {
    createCsv: () => string;
    downloadCsvAsBlob: (fileName: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useTableExport(table: TableAPI<any>): TableExport {
    const createCsv = React.useCallback(() => {
        return [
            table
                .getVisibleFlatColumns()
                .filter((column) => column.accessorFn != null)
                .map((column) => column.id)
                .map((value) => `"${value.toString().replace(/"/g, '""')}"`)
                .join(',')
        ]
            .concat(
                table.getPrePaginationRowModel().flatRows.map((row) =>
                    row
                        .getVisibleCells()
                        .filter((cell) => cell.column.accessorFn != null)
                        .map((cell) => cell.getValue())
                        .map((value) =>
                            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
                        )
                        .join(',')
                )
            )
            .join('\n');
    }, [table]);

    const downloadCsvAsBlob = React.useCallback(
        (fileName: string) => {
            const blob = new Blob([createCsv()], { type: 'text/csv' });
            const blobUrl = URL.createObjectURL(blob);
            const element = document.createElement('a', {});
            element.href = blobUrl;
            element.target = '_blank';
            element.download = `${fileName}.csv`;
            document.body.append(element);
            element.click();
            element.remove();
        },
        [createCsv]
    );

    return React.useMemo(
        () => ({
            createCsv,
            downloadCsvAsBlob
        }),
        [createCsv, downloadCsvAsBlob]
    );
}
