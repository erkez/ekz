import { Checkbox, Colors } from '@blueprintjs/core';
import { CaretDown, CaretRight } from '@blueprintjs/icons';
import React from 'react';

import { Classes } from '../../common';
import {
    type AccessorFn,
    type AggregationFnOption,
    type Column,
    type ColumnDef,
    type ColumnPinningPosition,
    createColumnHelper as createColumnHelperBase,
    type DeepKeys,
    type DeepValue,
    type FilterFnOption,
    type Getter,
    type Row,
    type RowData,
    type SortingFnOption,
    type StringHeaderIdentifier,
    type StringOrTemplateHeader,
    type Table
} from './reactTableBase';

export interface ColumnHelper<TData> {
    accessor: <
        TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
        TValue extends TAccessor extends AccessorFn<TData, infer TReturn>
            ? TReturn
            : TAccessor extends DeepKeys<TData>
              ? DeepValue<TData, TAccessor>
              : never
    >(
        accessor: TAccessor,
        column: TAccessor extends AccessorFn<TData>
            ? DisplayColumnDef<TData, TValue>
            : IdentifiedColumnDef<TData, TValue>
    ) => ColumnDef<TData, TValue>;
    display: (column: DisplayColumnDef<TData>) => ColumnDef<TData, unknown>;
    group: (column: GroupColumnDef<TData>) => ColumnDef<TData, unknown>;
    expansion: <
        TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
        TValue extends TAccessor extends AccessorFn<TData, infer TReturn>
            ? TReturn
            : TAccessor extends DeepKeys<TData>
              ? DeepValue<TData, TAccessor>
              : never
    >(
        accessor: TAccessor,
        column: ExpansionColumnDef<TData, TValue>
    ) => ColumnDef<TData, TValue>;
    selection: (column?: SelectionColumnDef<TData>) => ColumnDef<TData, unknown>;
}

export type ColumnDefTemplate<TProps extends object> =
    | string
    | ((props: TProps) => React.ReactNode);

export interface CellContext<TData extends RowData, TValue> {
    cell: Cell<TData, TValue>;
    column: Column<TData, TValue>;
    getValue: Getter<TValue>;
    renderValue: Getter<TValue | null>;
    row: Row<TData>;
    table: Table<TData>;
}

export interface CoreCell<TData extends RowData, TValue> {
    /**
     * The associated Column object for the cell.
     */
    column: Column<TData, TValue>;
    /**
     * Returns the rendering context (or props) for cell-based components like cells and aggregated cells. Use these props with your framework's `flexRender` utility to render these using the template of your choice:
     */
    getContext: () => CellContext<TData, TValue>;
    /**
     * Returns the value for the cell, accessed via the associated column's accessor key or accessor function.
     */
    getValue: CellContext<TData, TValue>['getValue'];
    /**
     * The unique ID for the cell across the entire table.
     */
    id: string;
    /**
     * Renders the value for a cell the same as `getValue`, but will return the `renderFallbackValue` if no value is found.
     */
    renderValue: CellContext<TData, TValue>['renderValue'];
    /**
     * The associated Row object for the cell.
     */
    row: Row<TData>;
}

export interface Cell<TData extends RowData, TValue>
    extends CoreCell<TData, TValue>,
        GroupingCell {}

export type GroupColumnDef<TData extends RowData, TValue = unknown> = GroupColumnDefBase<
    TData,
    TValue
> &
    ColumnIdentifiers<TData, TValue>;

export interface GroupColumnDefBase<TData extends RowData, TValue = unknown>
    extends ColumnDefBase<TData, TValue> {
    /**
     * The children columns of this group.
     */
    columns: Array<ColumnDef<TData, any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface GroupingCell {
    /**
     * Returns whether or not the cell is currently aggregated.
     */
    getIsAggregated: () => boolean;
    /**
     * Returns whether or not the cell is currently grouped.
     */
    getIsGrouped: () => boolean;
    /**
     * Returns whether or not the cell is currently a placeholder cell.
     */
    getIsPlaceholder: () => boolean;
}

export interface HeaderContext<TData, TValue> {
    /**
     * An instance of a column.
     */
    column: Column<TData, TValue>;
    /**
     * An instance of a header.
     */
    header: Header<TData, TValue>;
    /**
     * The table instance.
     */
    table: Table<TData>;
}

export interface Header<TData extends RowData, TValue>
    extends CoreHeader<TData, TValue>,
        ColumnSizingHeader {}

export type HeaderGroup<TData extends RowData> = CoreHeaderGroup<TData>;

export interface CoreHeaderGroup<TData extends RowData> {
    depth: number;
    headers: Array<Header<TData, unknown>>;
    id: string;
}

export interface CoreHeader<TData extends RowData, TValue> {
    /**
     * The col-span for the header.
     */
    colSpan: number;
    /**
     * The header's associated column object.
     */
    column: Column<TData, TValue>;
    /**
     * The depth of the header, zero-indexed based.
     */
    depth: number;
    /**
     * Returns the rendering context (or props) for column-based components like headers, footers and filters.
     */
    getContext: () => HeaderContext<TData, TValue>;
    /**
     * Returns the leaf headers hierarchically nested under this header.
     */
    getLeafHeaders: () => Array<Header<TData, unknown>>;
    /**
     * The header's associated header group object.
     */
    headerGroup: HeaderGroup<TData>;
    /**
     * The unique identifier for the header.
     */
    id: string;
    /**
     * The index for the header within the header group.
     */
    index: number;
    /**
     * A boolean denoting if the header is a placeholder header.
     */
    isPlaceholder: boolean;
    /**
     * If the header is a placeholder header, this will be a unique header ID that does not conflict with any other headers across the table.
     */
    placeholderId?: string;
    /**
     * The row-span for the header.
     */
    rowSpan: number;
    /**
     * The header's hierarchical sub/child headers. Will be empty if the header's associated column is a leaf-column.
     */
    subHeaders: Array<Header<TData, TValue>>;
}

export interface Header<TData extends RowData, TValue>
    extends CoreHeader<TData, TValue>,
        ColumnSizingHeader {}

export interface ColumnSizingHeader {
    /**
     * Returns an event handler function that can be used to resize the header. It can be used as an:
     * - `onMouseDown` handler
     * - `onTouchStart` handler
     *
     * The dragging and release events are automatically handled for you.
     */
    getResizeHandler: (context?: Document) => (event: unknown) => void;
    /**
     * Returns the current size of the header.
     */
    getSize: () => number;
    /**
     * Returns the offset measurement along the row-axis (usually the x-axis for standard tables) for the header. This is effectively a sum of the offset measurements of all preceding headers.
     */
    getStart: (position?: ColumnPinningPosition) => number;
}

interface ColumnDefExtensions<TData extends RowData, TValue = unknown>
    extends VisibilityColumnDef,
        ColumnPinningColumnDef,
        FiltersColumnDef<TData>,
        SortingColumnDef<TData>,
        GroupingColumnDef<TData, TValue>,
        ColumnSizingColumnDef {}

export interface ColumnSizingColumnDef {
    /**
     * Enables or disables column resizing for the column.
     */
    enableResizing?: boolean;
    /**
     * The maximum allowed size for the column
     */
    maxSize?: number;
    /**
     * The minimum allowed size for the column
     */
    minSize?: number;
    /**
     * The desired size for the column
     */
    size?: number;
}
export const SELECTION_ID = '_selection';
export interface GroupingColumnDef<TData extends RowData, TValue> {
    /**
     * The cell to display each row for the column if the cell is an aggregate. If a function is passed, it will be passed a props object with the context of the cell and should return the property type for your adapter (the exact type depends on the adapter being used).
     */
    aggregatedCell?: ColumnDefTemplate<ReturnType<Cell<TData, TValue>['getContext']>>;
    /**
     * The resolved aggregation function for the column.
     */
    aggregationFn?: AggregationFnOption<TData>;
    /**
     * Enables/disables grouping for this column.
     */
    enableGrouping?: boolean;
    /**
     * Specify a value to be used for grouping rows on this column. If this option is not specified, the value derived from `accessorKey` / `accessorFn` will be used instead.
     */
    getGroupingValue?: (row: TData) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface SortingColumnDef<TData extends RowData> {
    /**
     * Enables/Disables multi-sorting for this column.
     */
    enableMultiSort?: boolean;
    /**
     * Enables/Disables sorting for this column.
     */
    enableSorting?: boolean;
    /**
     * Inverts the order of the sorting for this column. This is useful for values that have an inverted best/worst scale where lower numbers are better, eg. a ranking (1st, 2nd, 3rd) or golf-like scoring
     */
    invertSorting?: boolean;
    /**
     * Set to `true` for sorting toggles on this column to start in the descending direction.
     */
    sortDescFirst?: boolean;
    /**
     * The sorting function to use with this column.
     * - A `string` referencing a built-in sorting function
     * - A custom sorting function
     */
    sortingFn?: SortingFnOption<TData>;
    /**
     * - `false`
     *   - Undefined values will be considered tied and need to be sorted by the next column filter or original index (whichever applies)
     * - `-1`
     *   - Undefined values will be sorted with higher priority (ascending) (if ascending, undefined will appear on the beginning of the list)
     * - `1`
     *   - Undefined values will be sorted with lower priority (descending) (if ascending, undefined will appear on the end of the list)
     */
    sortUndefined?: false | -1 | 1;
}

export interface FiltersColumnDef<TData extends RowData> {
    /**
     * The filter function to use with this column. Can be the name of a built-in filter function or a custom filter function.
     */
    filterFn?: FilterFnOption<TData>;
    /**
     * Enables/disables the **column** filter for this column.
     */
    enableColumnFilter?: boolean;
    /**
     * Enables/disables the **global** filter for this column.
     */
    enableGlobalFilter?: boolean;
}

export interface ColumnPinningColumnDef {
    /**
     * Enables/disables column pinning for this column. Defaults to `true`.
     */
    enablePinning?: boolean;
}

export interface VisibilityColumnDef {
    enableHiding?: boolean;
}

export interface ColumnFilterProps<TData, TValue> {
    column: Column<TData, TValue>;
    table: Table<TData>;
}

export interface ColumnDefBase<TData, TValue> extends ColumnDefExtensions<TData, TValue> {
    getUniqueValues?: AccessorFn<TData, unknown[]>;
    footer?: ColumnDefTemplate<HeaderContext<TData, TValue>>;
    cell?: ColumnDefTemplate<CellContext<TData, TValue>>;
    filter?: (props: ColumnFilterProps<TData, TValue>) => React.ReactNode;

    /**
     * When defined, the callback can return an optional class name that will be added to the specific cell.
     */
    getClassName?: (content: CellContext<TData, TValue>) => string | null | undefined;

    /**
     * Set to `true` to skip row click when the cell is clicked.
     *
     * @default false
     */
    skipRowClick?: boolean;
}

export interface DisplayColumnDef<TData, TValue = unknown>
    extends ColumnDefBase<TData, TValue>,
        IdIdentifier<TData, TValue> {}

export interface ExpansionColumnDef<TData, TValue = unknown>
    extends DisplayColumnDef<TData, TValue> {
    /**
     * When row depth is not 0 and not expandable, a left padding is added to the cell for alignment with
     * parent row.
     *
     * @default false
     */
    alwaysIncludeDepthPadding?: boolean;
}

export interface IdentifiedColumnDef<TData, TValue = unknown> extends ColumnDefBase<TData, TValue> {
    id?: string;
    header?: StringOrTemplateHeader<TData, TValue>;
}

type ColumnIdentifiers<TData extends RowData, TValue> =
    | IdIdentifier<TData, TValue>
    | StringHeaderIdentifier;

export interface IdIdentifier<TData extends RowData, TValue> {
    id: string;
    header?: StringOrTemplateHeader<TData, TValue>;
}

export type SelectionColumnDef<TData> = Omit<DisplayColumnDef<TData>, 'id' | 'cell' | 'header'>;

/**
 * Configuration for the table’s column utility popover (export/visibility/reorder/search).
 */
export type ColumnUtilityProps = {
    /**
     * Show the **Export** actions inside the utility panel.
     * Use when users should be able to export the current table view (CSV/XLSX/etc).
     *
     * @default false
     */
    showExport?: boolean;

    /**
     * Show the **Column Visibility** manager to show/hide columns.
     * When enabled, users can toggle column visibility via checkboxes.
     *
     * @default true
     */
    showColumnVisibility?: boolean;

    /**
     * Allow **Column Reorder** in the manager (drag to rearrange).
     * When disabled, the list is static and drag handles are hidden.
     *
     * @default true
     */
    canColumnReorder?: boolean;

    /**
     * Enable **Search** within the column list (filters by header/ID).
     * Helpful for wide tables with many columns.
     *
     * @default true
     */
    canColumnSearch?: boolean;

    /**
     * If true, the Column Utility shows each column's **id** as the label.
     * If false (default), it tries to show the column's header text.
     *
     * Useful when headers are complex React nodes or localized at render-time,
     * and you prefer a stable technical label in the manager.
     *
     * @default false
     */
    useIdAsLabel?: boolean;
};

export function createColumnHelper<TData>(): ColumnHelper<TData> {
    const base = createColumnHelperBase<TData>();
    return {
        ...base,
        expansion(accessor, column) {
            return base.accessor(accessor, {
                ...column,
                cell: (props) => (
                    <span
                        className={Classes.REACT_TABLE_ROW_EXPANDER_WRAPPER}
                        style={{ paddingLeft: props.row.depth * 25 }}>
                        {props.row.getCanExpand() ? (
                            <span
                                className={Classes.REACT_TABLE_ROW_EXPANDER}
                                onClick={props.row.getToggleExpandedHandler()}
                                data-skip-row-click={true}>
                                {props.row.getIsExpanded() ? (
                                    <CaretDown size={18} color={Colors.BLUE1} />
                                ) : (
                                    <CaretRight size={18} color={Colors.BLUE1} />
                                )}
                            </span>
                        ) : column.alwaysIncludeDepthPadding ? (
                            <span style={{ paddingLeft: 25 }} />
                        ) : null}
                        <span>
                            {typeof column.cell === 'string'
                                ? column.cell
                                : typeof column.cell === 'function'
                                  ? column.cell(props)
                                  : props.renderValue()}
                        </span>
                    </span>
                )
            } as DisplayColumnDef<TData, any>); // eslint-disable-line @typescript-eslint/no-explicit-any
        },
        selection(column) {
            return {
                ...column,
                cell: ({ row }) => (
                    <Checkbox
                        className={Classes.REACT_TABLE_SELECTION}
                        checked={row.getIsSelected()}
                        disabled={!row.getCanSelect()}
                        indeterminate={row.getIsSomeSelected()}
                        onChange={row.getToggleSelectedHandler()}
                    />
                ),
                enableResizing: false,
                enableSorting: false,
                header: ({ table }) => (
                    <Checkbox
                        className={Classes.REACT_TABLE_SELECTION}
                        checked={table.getIsAllRowsSelected()}
                        disabled={table.options.enableRowSelection === false}
                        indeterminate={table.getIsSomeRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                ),
                id: SELECTION_ID,
                size: 20,
                skipRowClick: true
            };
        }
    };
}
