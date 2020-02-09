import React from 'react';

import { DataTableRow, DataTableCell } from '@rmwc/data-table';

import { IUserData } from '../queryHelpers';

interface IProps {
    data: IUserData,
    type: string
}

export const UserListItem: React.FunctionComponent<IProps> = ({data, type}) => {
    //const articleDate = data.created_at ? new Date(data.created_at) : null;
    return (
        <DataTableRow>
            <DataTableCell>{data.first_name}</DataTableCell>
            <DataTableCell>{data.last_name}</DataTableCell>
            <DataTableCell>{data.email}</DataTableCell>
        </DataTableRow>
    )
}
