import { AnchorButton } from '@blueprintjs/core';
import cx from 'classnames';
import { Range } from 'immutable';
import invariant from 'invariant';
import * as React from 'react';

import { Classes, DISPLAYNAME_PREFIX } from '../../common';

export interface PaginationProps extends React.HTMLAttributes<HTMLUListElement> {
    /** Current selected page. */
    selectedPage: number;

    /** Handler that accepts the newly selected page by the user. */
    onPageChange: (nextPage: number) => void;

    /** True if component should be disabled. */
    disabled?: boolean;

    /** The total number of pages. */
    pageCount: number;

    /** The central number of pages to be displayed.
     *
     * @default 5
     */
    centerPagesDisplayed?: number;

    /** The number of pages to be displayed around the center pages.
     *
     * @default 1
     */
    marginPagesDisplayed?: number;

    /** The position to place the pagination list.
     *
     * @default "center"
     */
    position?: PaginationPosition;

    /** The message inside the previous page button.
     *
     * @default "Previous"
     */
    previousMessage?: React.ReactNode;

    /** The message inside the next page button.
     *
     * @default "Next"
     */
    nextMessage?: React.ReactNode;

    /** The aria message for the previous page button. */
    'aria-previous-page'?: string;

    /** The aria message for the next page button. */
    'aria-next-page'?: string;

    /** The aria message for the current page button. */
    'aria-current-page'?: string;
}

/** Pagination position */
export type PaginationPosition = 'left' | 'center' | 'right';

const Pagination: React.FC<PaginationProps> = React.forwardRef<HTMLUListElement, PaginationProps>(
    (props, ref) => {
        const {
            selectedPage,
            onPageChange,
            disabled,
            pageCount,
            centerPagesDisplayed = 5,
            marginPagesDisplayed = 1,
            position = 'center',
            previousMessage = 'Previous',
            nextMessage = 'Next',
            'aria-previous-page': ariaPreviousPage,
            'aria-next-page': ariaNextPage,
            'aria-current-page': ariaCurrentPage,
            ...ulProps
        } = props;

        invariant(Number.isInteger(selectedPage), 'selectedPage must be an integer');
        invariant(Number.isInteger(pageCount), 'pageCount must be an integer');
        invariant(
            Number.isInteger(centerPagesDisplayed),
            'centerPagesDisplayed must be an integer'
        );
        invariant(
            Number.isInteger(marginPagesDisplayed),
            'marginPagesDisplayed must be an integer'
        );

        const changePage = React.useCallback(
            (page: number) => () => onPageChange(page),
            [onPageChange]
        );

        const buildPage = React.useCallback(
            (page: number) => {
                return (
                    <li key={page}>
                        <AnchorButton
                            className={Classes.PAGINATION_PAGE}
                            disabled={page !== selectedPage && disabled}
                            minimal={true}
                            onClick={changePage(page)}
                            active={page === selectedPage}
                            aria-label={
                                page === selectedPage
                                    ? (ariaCurrentPage ?? 'Current page')
                                    : undefined
                            }
                            intent="primary">
                            {page + 1}
                        </AnchorButton>
                    </li>
                );
            },
            [selectedPage, disabled, changePage, ariaCurrentPage]
        );

        if (pageCount === 0) {
            return null;
        }

        const hasPrevious = selectedPage > 0;
        const hasNext = selectedPage < pageCount - 1;

        const halfRange = Math.floor(centerPagesDisplayed! / 2);

        const pageRange = Range(0, pageCount)
            .skip(Math.min(selectedPage - halfRange, pageCount - centerPagesDisplayed!))
            .take(centerPagesDisplayed!);

        const pages = pageRange.map(buildPage);

        const leftMargin =
            pageRange.first(0) > marginPagesDisplayed! - 1
                ? Range(0, marginPagesDisplayed).map(buildPage)
                : null;

        const leftBreak =
            pageRange.first(0) < marginPagesDisplayed! + 1 ? null : (
                <li>
                    <AnchorButton
                        className={Classes.PAGINATION_PAGE}
                        disabled={disabled}
                        onClick={changePage(Math.max(0, selectedPage - centerPagesDisplayed!))}
                        minimal={true}>
                        ...
                    </AnchorButton>
                </li>
            );

        const rightMargin =
            pageRange.last(pageCount - 1) < pageCount - marginPagesDisplayed!
                ? Range(pageCount - marginPagesDisplayed!, pageCount).map(buildPage)
                : null;

        const rightBreak =
            pageRange.last(pageCount - 1) > pageCount - marginPagesDisplayed! - 2 ? null : (
                <li>
                    <AnchorButton
                        className={Classes.PAGINATION_PAGE}
                        disabled={disabled}
                        onClick={changePage(
                            Math.min(pageCount - 1, selectedPage + centerPagesDisplayed!)
                        )}
                        minimal={true}>
                        ...
                    </AnchorButton>
                </li>
            );

        return (
            <ul
                ref={ref}
                {...ulProps}
                className={cx(Classes.PAGINATION, props.className, position)}>
                <li>
                    <AnchorButton
                        className={Classes.PAGINATION_BUTTON}
                        disabled={disabled || !hasPrevious}
                        onClick={changePage(selectedPage - 1)}
                        icon="caret-left"
                        minimal={true}
                        aria-label={ariaPreviousPage ?? 'Previous page'}>
                        {previousMessage}
                    </AnchorButton>
                </li>
                {leftMargin}
                {leftBreak}
                {pages}
                {rightBreak}
                {rightMargin}
                <li>
                    <AnchorButton
                        className={Classes.PAGINATION_BUTTON}
                        disabled={disabled || !hasNext}
                        onClick={changePage(selectedPage + 1)}
                        rightIcon="caret-right"
                        minimal={true}
                        aria-label={ariaNextPage ?? 'Next page'}>
                        {nextMessage}
                    </AnchorButton>
                </li>
            </ul>
        );
    }
);

Pagination.displayName = `${DISPLAYNAME_PREFIX}.Pagination`;

export { Pagination };
