import { useReactTable } from '@tanstack/react-table';

import {
    getCoreRowModel,
    getExpandedRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type InitialTableState,
    type Row,
    type Table as TableAPI,
    type TableOptions
} from './reactTableBase';

/**
 * `UseTableOptions` is a reexport of `TableOptions` with more options and relevant documentation.
 * Not all properties supported by `@tanstack/react-table` have been documented here.
 */
export interface UseTableOptions<T = unknown>
    extends Omit<TableOptions<T>, 'getCoreRowModel' | 'state' | 'onStateChange'> {
    /**
     * The typed column definitions. Every column in the table must have its own definition.
     */
    columns: TableOptions<T>['columns'];

    /**
     * The table data. Each row will receive an instance of this element.
     */
    data: TableOptions<T>['data'];

    /**
     * The table state can be provided to make the it controlled. See the documentation regarding recommended usage
     * of this property.
     */
    state?: TableOptions<T>['state'];

    /**
     * Use this option to optionally pass initial state to the table. This state will be used
     * when resetting various table states either automatically by the table (eg. `options.autoResetPageIndex`)
     * or via functions like `table.resetRowSelection()`.
     * */
    initialState?: InitialTableState;

    /**
     * Allows row selection. An optional function can be provided to conditionally allow row selection.
     *
     * @default true
     */
    enableRowSelection?: TableOptions<T>['enableRowSelection'];

    /**
     * Allows row expansion.
     *
     * @default true
     */
    enableExpanding?: TableOptions<T>['enableExpanding'];

    /**
     * Allows column sorting.
     *
     * @default true
     */
    enableSorting?: TableOptions<T>['enableSorting'];

    /**
     * Allows general filtering.
     *
     * @default true
     */
    enableFilters?: TableOptions<T>['enableFilters'];

    /**
     * Allows global filter in top toolbar.
     *
     * @default true
     */
    enableGlobalFilter?: boolean;

    /**
     * Set true to display table loading indicator.
     *
     * @default false
     */
    isLoading?: boolean;

    /**
     * When set, the provided component will be used instead of the original `<Spinner />`.
     */
    loadingIndicator?: React.ReactNode;

    /**
     * When defined, the callback can return an optional class name that will be added to the specific row.
     * Depending on the CSS properties in the class, it might be needed to use `!important` to take higher
     * precedence.
     */
    getRowClassName?: (originalRow: T, index: number) => string | null | undefined;

    /**
     * When defined, callback is called to determine if the row is clickable. Return `false` to disable clicking.
     */
    getRowClickable?: (originalRow: T, index: number) => boolean;

    /**
     * Callback is called when row is clicked.
     */
    onRowClick?: (originalRow: T, row: Row<T>, event: React.MouseEvent<HTMLDivElement>) => void;

    /**
     * Callback is called when there are changes to the `pagination` property of the table `state`.
     */
    onPaginationChange?: TableOptions<T>['onPaginationChange'];

    /**
     * Callback is called when there are changes to the `rowSelection` property of the table `state`.
     */
    onRowSelectionChange?: TableOptions<T>['onRowSelectionChange'];

    /**
     * Callback is called when there are changes to the `expanded` property of the table `state`.
     */
    onExpandedChange?: TableOptions<T>['onExpandedChange'];

    /**
     * Callback is called when there are changes to the `globalFilter` property of the table `state`.
     */
    onGlobalFilterChange?: TableOptions<T>['onGlobalFilterChange'];

    /**
     * The callback might return an optional list of sub-rows to be rendered when the parent row
     * is expanded.
     */
    getSubRows?: (originalRow: T, index: number) => undefined | T[];

    /**
     * The callback might return an optional `React.ReactNode` to be rendered below the expanded row.
     */
    getSubComponent?: (originalRow: T, index: number) => undefined | React.ReactNode;

    /**
     * Normally, the sub-components can be controlled using the standard `state.expanded` and its related
     * event handlers. When that is not desirable, provide this callback which will override the `expanded`
     * state. When using this callback, the column helper `expansion` only controls sub-rows.
     */
    getSubComponentExpanded?: (originalRow: T, index: number) => boolean;
}

export interface TableMetadata {
    enableGlobalFilter: UseTableOptions['enableGlobalFilter'];
    getRowClickable: UseTableOptions['getRowClickable'];
    getSubComponent: UseTableOptions['getSubComponent'];
    getSubComponentExpanded: UseTableOptions['getSubComponentExpanded'];
    getRowClassName: UseTableOptions['getRowClassName'];
    isLoading: UseTableOptions['isLoading'];
    loadingIndicator: UseTableOptions['loadingIndicator'];
    onRowClick: UseTableOptions['onRowClick'];
}

export function useTable<T>(options: UseTableOptions<T>): TableAPI<T> {
    return useReactTable({
        columnResizeMode: 'onChange',
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        ...options,
        meta: {
            ...options.meta,
            enableGlobalFilter: options.enableGlobalFilter ?? true,
            getRowClickable: options.getRowClickable,
            getSubComponent: options.getSubComponent,
            getSubComponentExpanded: options.getSubComponentExpanded,
            getRowClassName: options.getRowClassName,
            isLoading: options.isLoading,
            loadingIndicator: options.loadingIndicator,
            onRowClick: options.onRowClick
        }
    });
}
