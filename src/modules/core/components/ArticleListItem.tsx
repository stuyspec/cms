import React from 'react';

import { DataTableRow, DataTableCell } from '@rmwc/data-table';

import { IArticleData } from '../queryHelpers';

interface IProps {
    data: IArticleData,
    type: string
}

export const ArticleListItem: React.FunctionComponent<IProps> = ({data, type}) => {
    const articleDate = data.created_at ? new Date(data.created_at) : null;
    return (
        <DataTableRow>
            <DataTableCell><a href={`/${type}/edit/${data.slug}`}>{data.title}</a></DataTableCell>
            <DataTableCell>{data.volume}</DataTableCell>
            <DataTableCell>{data.issue}</DataTableCell>
            <DataTableCell alignEnd>{articleDate ? articleDate.toDateString() : "Unknown"}</DataTableCell>
        </DataTableRow>
    )
}
