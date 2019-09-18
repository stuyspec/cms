import React from 'react';

import { DataTableRow, DataTableCell } from '@rmwc/data-table';

import { IArticleData } from '../queryHelpers';

interface IProps {
    data: IArticleData
}

export const ArticleListItem: React.FunctionComponent<IProps> = ({data}) => {
    const articleDate = data.created_at ? new Date(data.created_at) : null;
    return (
        <DataTableRow>
            <DataTableCell>{data.title}</DataTableCell>
            <DataTableCell>{data.volume}</DataTableCell>
            <DataTableCell>{data.issue}</DataTableCell>
            <DataTableCell>{data.section.name}</DataTableCell>
            <DataTableCell alignEnd>{articleDate ? articleDate.toDateString() : "Unknown"}</DataTableCell>
        </DataTableRow>
    )
}