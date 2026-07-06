import { SortAsc, SortDesc } from '@blueprintjs/icons';
import React from 'react';

import { Classes } from '../../common';
import { ColumnFilter } from './columnFilter';
import { flexRender, type HeaderGroup, type Table } from './reactTableBase';

const LEAF_MIN_TOTAL_WIDTH_PX = 41; // expected total leaf width incl. padding + border
const COLUMN_BORDER_PX = 1;

interface HeaderGroupProps<TData = unknown> {
    table: Table<TData>;
    headerGroup: HeaderGroup<TData>;
}

const stopPropagation = (e: React.MouseEvent): void => e.stopPropagation();

const getHeaderMinWidth = (header: HeaderGroupProps['headerGroup']['headers'][number]): number => {
    if (header.isPlaceholder) return 0;

    if (header.subHeaders != null && header.subHeaders.length > 0) {
        const childrenMin = header.subHeaders.reduce(
            (sum, subHeader) => sum + getHeaderMinWidth(subHeader),
            0
        );

        return childrenMin + COLUMN_BORDER_PX;
    }

    return header.column.columnDef.minSize ?? LEAF_MIN_TOTAL_WIDTH_PX;
};

export const HeaderGroupWrapper: React.FC<HeaderGroupProps> = function HeaderGroup(
    props: HeaderGroupProps
) {
    return (
        <div className={Classes.REACT_TABLE_ROW}>
            {props.headerGroup.headers.map((header) =>
                header.isPlaceholder ? (
                    <div
                        key={header.id}
                        className={Classes.REACT_TABLE_HEAD_CELL}
                        style={{ width: `calc(var(--header-${header?.id}-size) * 1px)` }}
                    />
                ) : (
                    <div
                        key={header.id}
                        className={Classes.REACT_TABLE_HEAD_CELL}
                        data-sortable={header.column.getCanSort()}
                        data-has-filter={header.column.getCanFilter()}
                        style={{
                            display: 'grid',
                            gridTemplateRows: header.column.getCanFilter() ? 'auto auto' : 'auto',
                            justifyContent:
                                header.subHeaders && header.subHeaders.length > 0
                                    ? 'center'
                                    : undefined,
                            minWidth: `${getHeaderMinWidth(header)}px`,
                            rowGap: 4,
                            textAlign:
                                header.subHeaders && header.subHeaders.length > 0
                                    ? 'center'
                                    : 'left',
                            width: `calc(var(--header-${header?.id}-size) * 1px)`
                        }}
                        onClick={header.column.getToggleSortingHandler()}>
                        <div
                            className={Classes.REACT_TABLE_HEAD_CELL_CONTENT}
                            style={{ display: 'flex', gap: 4 }}>
                            <span
                                className={Classes.REACT_TABLE_HEAD_CELL_CONTENT_LABEL}
                                data-ellipsize="false">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                            {header.column.getCanSort() && (
                                <span className={Classes.REACT_TABLE_SORTING}>
                                    {{
                                        asc: <SortAsc size={16} />,
                                        desc: <SortDesc size={16} />
                                    }[header.column.getIsSorted() as string] ?? null}
                                </span>
                            )}
                        </div>
                        {header.column.getCanResize() && (
                            <div
                                onDoubleClick={() => header.column.resetSize()}
                                onClick={stopPropagation}
                                onMouseDown={header.getResizeHandler()}
                                onTouchStart={header.getResizeHandler()}
                                className={Classes.REACT_TABLE_RESIZER}
                                data-resizing={header.column.getIsResizing()}
                            />
                        )}
                        {header.column.getCanFilter() && (
                            <div
                                className={Classes.REACT_TABLE_HEAD_FILTER}
                                data-can-resize={header.column.getCanResize()}
                                onClick={stopPropagation}
                                style={{
                                    width: `calc(var(--header-${header.id}-size) * 1px - 20px)`
                                }}>
                                <ColumnFilter table={props.table} column={header.column} />
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    );
};
