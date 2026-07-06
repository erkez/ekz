import {
    Button,
    Classes as CoreClasses,
    type Elevation,
    InputGroup,
    Intent,
    type MaybeElement,
    MenuItem,
    NonIdealState,
    type Props,
    ResizeSensor,
    Spinner
} from '@blueprintjs/core';
import { type IconName, Search, Th, Cross } from '@blueprintjs/icons';
import { Select, type ItemRenderer } from '@blueprintjs/select';
import { useDebouncedEffect } from '@ekz/react-utils';
import classNames from 'classnames';
import * as React from 'react';

import { Classes, DISPLAYNAME_PREFIX } from '../../common';
import { Pagination } from '../pagination';
import type { ColumnDefBase } from './columnHelpers';
import { HeaderGroupWrapper } from './headerGroup';
import { flexRender, type Table as TableAPI } from './reactTableBase';
import { useTableMessages } from './tableMessages';
import { TableTheme } from './theme';
import { useAutoColumnSizer } from './useAutoColumnSizer';
import { useAutoHeight } from './useAutoHeight';
import { useGroupedHeaderColumnSizer } from './useGroupedHeaderColumnSizer';
import type { TableMetadata } from './useTable';

export interface TypedTable extends React.FC<TableProps> {
    ofType<T>(): React.FC<TableProps<T>>;
}

export interface TableProps<T = unknown> extends Props {
    /**
     * The table instance created using `useTable`. See the type `UseTableOptions`, as `data` and `columns` are provided to the hook.
     */
    table: TableAPI<T>;

    /**
     * Set to adjust the table theme.
     *
     * @default TableTheme.Standard
     */
    theme?: TableTheme;

    /**
     * Controls the intensity of the drop shadow beneath the table: the higher
     * the elevation, the higher the drop shadow. Only valid for `TableTheme.Standard`.
     * Set to `-1` to disable border and drop shadow.
     *
     * @default 2
     */
    elevation?: Elevation | -1;

    /**
     * Set to `false` to hide the table header.
     *
     * @default true
     */
    displayHeader?: boolean;

    /**
     * Set to `false` to hide the table pagination.
     *
     * @default true
     */
    displayPagination?: boolean;

    /**
     * Optional icon for the empty table non-ideal state.
     *
     * @default Icons.Table
     */
    noResultsIcon?: IconName | MaybeElement;

    /**
     * Optional title text for the empty table non-ideal state.
     *
     * @default "No results available"
     */
    noResultsTitle?: React.ReactNode;

    /**
     * Optional description for the empty table non-ideal state.
     */
    noResultsDescription?: React.ReactNode;

    /**
     * Optional action for the empty table non-ideal state.
     */
    noResultsActions?: React.JSX.Element;

    /**
     * Optional element to display in the left area of the top toolbar.
     */
    leftToolbar?: React.ReactNode;

    /**
     * Optional element to display in the right area of the top toolbar, to the left of the global filter, if enabled.
     */
    rightToolbar?: React.ReactNode;

    /**
     * Set a tuple with `[minPageSize, maxPageSize]` to automatically set page size based on the parent height.
     */
    autoHeight?: [minPageSize: number, maxPageSize: number];

    /**
     * Set the parent height property with the value to be used for auto-height calculation.
     * If not provided, it will use the height of the parent element.
     */
    autoHeightParentHeight?: number;

    /**
     * The maximum number of pixels that the auto-height should use for the table parent.
     * When not set, it can grow unbounded up to the maximum page size.
     */
    autoHeightMaxHeight?: number;

    /**
     * When `autoHeight` is set and this value is not provided, it is automatically calculated. Set a value to disable automatic
     * calculation of average row height.
     */
    autoHeightAverageRowHeight?: number;

    /**
     * When set to true, every change to row or cell height will be tracked. Only useful of the height can be altered dynamically.
     *
     * @default false
     */
    autoHeightObserveRows?: boolean;

    /**
     * Set to `false` to remove ellipsis of values that do not fit cell width.
     * Property is only in effect for the `TableTheme.Segment`.
     *
     * @default true
     */
    ellipsize?: boolean;

    /**
     * Enables manual control of the table's page size.
     * When `true`, a page-size control is rendered in the pagination footer.
     *
     *    @default true
     */
    manualPageSizeVisible?: boolean;

    /**
     * Optional list of page-size options displayed in the Select.
     *
     * If omitted, the default list will be used:
     * `[10, 30, 50, 100]`
     *
     * When `autoHeight` is enabled on the table, an additional
     * `"Auto"` option is prepended that disables manual page size.
     *
     * PERFORMANCE NOTE:
     * This array should be memoized to prevent
     * unnecessary recalculations and to ensure stable references in React.
     */
    manualPageSizeOptions?: number[];
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 30, 50, 100];

interface PageSizeOption {
    value: number | null; // null = Auto
    label: string;
}

const Table: TypedTable = Object.assign(
    (props: TableProps) => {
        const {
            displayHeader = true,
            displayPagination = true,
            elevation = 2 as Elevation,
            ellipsize = true,
            theme = TableTheme.Standard,
            manualPageSizeVisible,
            manualPageSizeOptions
        } = props;

        const table = props.table;
        const tableState = table.getState();
        const metadata = table.options.meta as TableMetadata;
        const tableMessages = useTableMessages();

        const columnSizeVars = React.useMemo(() => {
            const headers = table.getFlatHeaders();
            return headers.reduce(
                (result, header) => {
                    result[`--header-${header.id}-size`] = header.getSize();
                    result[`--col-${header.column.id}-size`] = header.column.getSize();
                    return result;
                },
                {} as { [key: string]: number }
            );
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [tableState.columnSizing, tableState.columnSizingInfo]);

        const setGlobalFilter = table.setGlobalFilter;

        const handleGlobalFilterChange = React.useCallback(
            (event: React.SyntheticEvent<HTMLInputElement>) =>
                setGlobalFilter(event.currentTarget.value),
            [setGlobalFilter]
        );

        const clearGlobalFilter = React.useCallback(() => setGlobalFilter(''), [setGlobalFilter]);

        const displayTopToolbar =
            (props.leftToolbar != null && props.leftToolbar !== false) ||
            (props.rightToolbar != null && props.rightToolbar !== false) ||
            metadata.enableGlobalFilter;

        const [ref, setRef] = React.useState<HTMLDivElement | null>(null);
        const bodyRef = React.useRef<HTMLDivElement>(null);
        const nonIdealStateRef = React.useRef<HTMLDivElement>(null);
        const autoHeightProp = props.autoHeight;

        const manualPageSizeEnabled = manualPageSizeVisible ?? true;

        const finalPageSizeOptions: number[] | null = React.useMemo(() => {
            if (!manualPageSizeEnabled) return null;

            return manualPageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS;
        }, [manualPageSizeEnabled, manualPageSizeOptions]);

        const [manualPageSizeValue, setManualPageSizeValue] = React.useState<number | null>(null);

        const pageSizeSelectItems: PageSizeOption[] | null = React.useMemo(() => {
            if (!finalPageSizeOptions) return null;

            const items = finalPageSizeOptions.map((n) => ({
                label: String(n),
                value: n
            }));

            if (autoHeightProp) {
                return [{ value: null, label: 'Auto' }, ...items];
            }

            return items;
        }, [finalPageSizeOptions, autoHeightProp]);

        const selectedPageSizeItem = React.useMemo(() => {
            if (!pageSizeSelectItems) return undefined;

            return pageSizeSelectItems.find((opt) => opt.value === manualPageSizeValue);
        }, [pageSizeSelectItems, manualPageSizeValue]);

        const isAutoHeightEnabled = autoHeightProp !== undefined;

        const autoHeightValue = manualPageSizeValue == null ? autoHeightProp : undefined;

        const handleResize = useAutoHeight(
            autoHeightValue,
            props.autoHeightParentHeight,
            props.autoHeightMaxHeight,
            props.autoHeightAverageRowHeight,
            props.autoHeightObserveRows,
            props.theme,
            table,
            ref,
            bodyRef,
            nonIdealStateRef
        );
        const { recalculate: recalcColumnSizing } = useAutoColumnSizer(ref, table, props.theme);

        const groupedHeaderColumnSizeVars = useGroupedHeaderColumnSizer(table, tableState);

        const lastObservedWidthRef = React.useRef<number | null>(null);
        const resizeRafIdRef = React.useRef<number | null>(null);

        // Clear any pending rAF on unmount to avoid calling setState after dispose
        React.useEffect(
            () => () => {
                if (resizeRafIdRef.current != null) {
                    cancelAnimationFrame(resizeRafIdRef.current);
                }
            },
            []
        );

        const handleColumnsResize = React.useCallback(
            (entries: ResizeObserverEntry[]) => {
                const rawWidth = entries[0]?.contentRect?.width;

                if (rawWidth == null) return;

                const width = Math.round(rawWidth);
                const prev = lastObservedWidthRef.current;

                if (prev == null || Math.abs(prev - width) >= 2) {
                    lastObservedWidthRef.current = width;

                    if (resizeRafIdRef.current != null) {
                        cancelAnimationFrame(resizeRafIdRef.current);
                    }

                    resizeRafIdRef.current = requestAnimationFrame(() => {
                        recalcColumnSizing();
                        resizeRafIdRef.current = null;
                    });
                }

                if (isAutoHeightEnabled) {
                    handleResize(entries);
                }
            },
            [isAutoHeightEnabled, handleResize, recalcColumnSizing]
        );

        const loadingIndicator =
            metadata.loadingIndicator != null ? (
                metadata.loadingIndicator
            ) : (
                <Spinner intent={Intent.PRIMARY} size={40} />
            );

        const targetRef = React.useRef<HTMLDivElement | null>(ref);
        React.useEffect(() => {
            targetRef.current = ref;
        }, [ref]);

        useDebouncedEffect(
            500,
            () => {
                if (manualPageSizeValue != null && manualPageSizeValue > 0) {
                    table.setPageSize(manualPageSizeValue);
                }
            },
            [manualPageSizeValue, table]
        );

        const handleSelectPageSize = React.useCallback((item: PageSizeOption) => {
            if (item.value === null) {
                setManualPageSizeValue(null); // Auto
            } else {
                setManualPageSizeValue(item.value);
            }
        }, []);

        const renderPageSizeOption: ItemRenderer<PageSizeOption> = React.useCallback(
            (item: PageSizeOption, { handleClick, modifiers }) => {
                if (!modifiers.matchesPredicate) {
                    return null;
                }

                return (
                    <MenuItem
                        key={item.value}
                        text={item.label}
                        active={modifiers.active}
                        disabled={modifiers.disabled}
                        onClick={handleClick}
                    />
                );
            },
            []
        );

        const prevTablePageSizeRef = React.useRef(tableState.pagination.pageSize);

        React.useEffect(() => {
            prevTablePageSizeRef.current = tableState.pagination.pageSize;
        }, [tableState.pagination.pageSize]);

        React.useEffect(() => {
            const tablePageSize = tableState.pagination.pageSize;
            const prev = prevTablePageSizeRef.current;

            const shouldSync =
                manualPageSizeEnabled &&
                prev !== tablePageSize &&
                !(autoHeightProp && manualPageSizeValue == null) &&
                manualPageSizeValue !== tablePageSize;

            if (prev !== tablePageSize) {
                prevTablePageSizeRef.current = tablePageSize;
            }

            if (shouldSync) {
                setManualPageSizeValue(tablePageSize);
            }
        }, [
            manualPageSizeEnabled,
            autoHeightProp,
            manualPageSizeValue,
            tableState.pagination.pageSize
        ]);

        React.useEffect(() => {
            const shouldAutoSelect =
                manualPageSizeEnabled && !autoHeightProp && manualPageSizeValue == null;

            if (!shouldAutoSelect) return;

            const firstNumericOption = pageSizeSelectItems?.find((o) => o.value != null);

            if (firstNumericOption) {
                setManualPageSizeValue(firstNumericOption.value);
            }
        }, [manualPageSizeEnabled, autoHeightProp, manualPageSizeValue, pageSizeSelectItems]);

        return (
            <ResizeSensor
                targetRef={targetRef as React.RefObject<HTMLElement>}
                observeParents={true}
                onResize={handleColumnsResize}>
                <div
                    ref={setRef}
                    className={classNames(Classes.REACT_TABLE, props.className, {
                        [CoreClasses.elevationClass((elevation as Elevation)!)]:
                            elevation! >= 0 && theme === TableTheme.Standard
                    })}
                    data-theme={theme ?? TableTheme.Standard}>
                    {displayTopToolbar && (
                        <div className={Classes.REACT_TABLE_TOP_TOOLBAR}>
                            <div className={Classes.REACT_TABLE_TOP_TOOLBAR_LEFT}>
                                {props.leftToolbar}
                            </div>
                            <div className={Classes.REACT_TABLE_TOP_TOOLBAR_RIGHT}>
                                {props.rightToolbar}
                                {metadata.enableGlobalFilter && (
                                    <InputGroup
                                        className={Classes.REACT_TABLE_GLOBAL_FILTER}
                                        leftIcon={<Search />}
                                        rightElement={
                                            tableState.globalFilter != null &&
                                            tableState.globalFilter.length > 0 ? (
                                                <Button
                                                    icon={<Cross />}
                                                    onClick={clearGlobalFilter}
                                                    minimal={true}
                                                />
                                            ) : (
                                                <></>
                                            )
                                        }
                                        value={tableState.globalFilter ?? ''}
                                        onChange={handleGlobalFilterChange}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                    <div
                        className={Classes.REACT_TABLE_CONTENT}
                        data-top-toolbar={displayTopToolbar}
                        data-loading={metadata.isLoading}
                        style={{ ...columnSizeVars, ...groupedHeaderColumnSizeVars }}>
                        {metadata.isLoading && (
                            <div className={Classes.REACT_TABLE_LOADING}>{loadingIndicator}</div>
                        )}
                        {displayHeader && (
                            <div className={Classes.REACT_TABLE_HEAD}>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <HeaderGroupWrapper
                                        key={headerGroup.id}
                                        headerGroup={headerGroup}
                                        table={table}
                                    />
                                ))}
                            </div>
                        )}
                        {table.getRowCount() === 0 ? (
                            <div
                                ref={nonIdealStateRef}
                                className={Classes.REACT_TABLE_EMPTY}
                                data-loading={metadata.isLoading}>
                                {metadata.isLoading ? null : (
                                    <NonIdealState
                                        icon={props.noResultsIcon ?? <Th size={64} />}
                                        title={
                                            props.noResultsTitle ??
                                            tableMessages.noResultsTitle ??
                                            'No results available'
                                        }
                                        description={props.noResultsDescription}
                                        action={props.noResultsActions}
                                    />
                                )}
                            </div>
                        ) : tableState.columnSizingInfo.isResizingColumn ? (
                            <MemoizedTableBodyForResize
                                table={table}
                                ellipsize={ellipsize}
                                metadata={metadata}
                            />
                        ) : (
                            <TableBody
                                ref={bodyRef}
                                table={table}
                                ellipsize={ellipsize}
                                metadata={metadata}
                            />
                        )}
                    </div>

                    {displayPagination && (manualPageSizeEnabled || table.getPageCount() > 1) && (
                        <div className={Classes.REACT_TABLE_PAGINATION}>
                            {manualPageSizeEnabled && pageSizeSelectItems != null && (
                                <div style={{ flexShrink: 1, flexGrow: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ whiteSpace: 'nowrap' }}>Rows per page:</span>

                                        <Select<PageSizeOption>
                                            items={pageSizeSelectItems}
                                            itemRenderer={renderPageSizeOption}
                                            onItemSelect={handleSelectPageSize}
                                            filterable={false}>
                                            <Button
                                                minimal={true}
                                                outlined={true}
                                                rightIcon="caret-down"
                                                text={
                                                    selectedPageSizeItem?.label ??
                                                    (manualPageSizeValue === null
                                                        ? 'Auto'
                                                        : String(manualPageSizeValue))
                                                }
                                            />
                                        </Select>
                                    </div>
                                </div>
                            )}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    flexShrink: 1,
                                    flexGrow: 1,
                                    alignSelf: 'flex-end'
                                }}>
                                <Pagination
                                    centerPagesDisplayed={3}
                                    selectedPage={table.getState().pagination.pageIndex}
                                    onPageChange={table.setPageIndex}
                                    pageCount={table.getPageCount()}
                                    previousMessage={null}
                                    nextMessage={null}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </ResizeSensor>
        );
    },
    {
        displayName: `${DISPLAYNAME_PREFIX}.Table`,
        ofType: function ofType<T>(): React.FC<TableProps<T>> {
            return Table as React.FC<TableProps<T>>;
        }
    }
);

interface TableBodyProps<T> {
    ellipsize?: boolean;

    table: TableAPI<T>;

    metadata: TableMetadata;
}

const TableBody = React.forwardRef(function TableBody<T>(
    props: TableBodyProps<T>,
    ref: React.Ref<HTMLDivElement>
) {
    const onRowClick = props.metadata.onRowClick;

    return (
        <div ref={ref} className={Classes.REACT_TABLE_BODY}>
            {props.table.getRowModel().rows.map((row) => {
                const shouldRenderSubComponent =
                    props.metadata.getSubComponentExpanded != null
                        ? props.metadata.getSubComponentExpanded(row.original, row.index)
                        : row.getIsExpanded();
                const subComponent =
                    shouldRenderSubComponent &&
                    props.metadata.getSubComponent &&
                    props.metadata.getSubComponent(row.original, row.index);

                const clickable =
                    onRowClick != null && props.metadata.getRowClickable != null
                        ? props.metadata.getRowClickable(row.original, row.index)
                        : onRowClick != null;

                const className =
                    props.metadata.getRowClassName != null &&
                    props.metadata.getRowClassName(row.original, row.index);

                const onClick =
                    clickable && onRowClick != null
                        ? (event: React.MouseEvent<HTMLDivElement>): void => {
                              let target: Element = event.target as Element;

                              while (
                                  (target instanceof HTMLElement || target instanceof SVGElement) &&
                                  target.parentElement instanceof Element &&
                                  !target.classList.contains(Classes.REACT_TABLE_CELL) &&
                                  !target.dataset.skipRowClick
                              ) {
                                  target = target.parentElement;
                              }

                              if (!('dataset' in target) || !target.dataset.skipRowClick) {
                                  onRowClick(row.original, row, event);
                              }
                          }
                        : undefined;

                return (
                    <React.Fragment key={row.id}>
                        <div
                            className={classNames(Classes.REACT_TABLE_ROW, className)}
                            data-depth={row.depth}
                            data-clickable={clickable}
                            onClick={onClick}>
                            {row.getVisibleCells().map((cell) => {
                                const definition = cell.column.columnDef as ColumnDefBase<
                                    T,
                                    unknown
                                >;
                                const customClassName =
                                    definition.getClassName != null
                                        ? definition.getClassName(cell.getContext())
                                        : null;
                                return (
                                    <div
                                        key={cell.id}
                                        className={classNames(
                                            Classes.REACT_TABLE_CELL,
                                            customClassName,
                                            'grouped'
                                        )}
                                        data-ellipsize={props.ellipsize}
                                        data-skip-row-click={definition.skipRowClick}
                                        style={{
                                            width: `calc(var(--col-${cell.column.id}-size) * 1px)`
                                        }}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                );
                            })}
                        </div>
                        {subComponent != null && subComponent !== false && (
                            <div className={Classes.REACT_TABLE_ROW_SUB_COMPONENT}>
                                {subComponent}
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
});

const MemoizedTableBodyForResize = React.memo(
    TableBody,
    (prev, next) => prev.table.options.data === next.table.options.data
) as typeof TableBody;

export { Table };
