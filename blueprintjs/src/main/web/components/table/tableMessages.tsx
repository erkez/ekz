import * as React from 'react';

export type TableMessages = {
    noResultsTitle?: React.ReactNode;
};

export const TableMessagesContext = React.createContext<TableMessages>({});

export function useTableMessages(): TableMessages {
    return React.useContext(TableMessagesContext);
}
