import * as React from 'react';

import { Typography } from '@rmwc/typography';
import { IconButton } from '@rmwc/icon-button';
import { ArticleCard } from './ArticleCard';
import { ArticleListItem } from './ArticleListItem';

import { ISearchResults } from '../queryHelpers';
import {
    DataTable,
    DataTableHead,
    DataTableHeadCell,
    DataTableBody,
    DataTableContent,
    DataTableRow
} from '@rmwc/data-table';

import { createUseStyles } from 'react-jss';

const cardPadding = {
    marginBottom: "10px"
}

interface IProps {
    results: Array<ISearchResults | undefined>,
    type: string
}

const useStyles = createUseStyles({
    Header: {
        display: "flex",
        flexDirection: "row"
    }
})

export const SearchResults: React.FunctionComponent<IProps> = ({ results, type }) => {
    const styles = useStyles();

    const [isListView, setIsListView] = React.useState(true);

    return (
        <>
            <div className={styles.Header}>
                <Typography use="headline3"><b>Search Results</b></Typography>
                <IconButton
                    icon={isListView ? "view_stream" : "view_list"}
                    onClick={() => setIsListView(!isListView)}
                    title={isListView ? "Stream view" : "List view"}
                />
            </div>
            <SearchResultsItems isListView={isListView} results={results} type={type} />
        </>
    )


}

interface ISearchResultsProps {
    isListView: boolean,
    results: Array<ISearchResults | undefined>,
    type: string
}

const SearchResultsItems: React.FunctionComponent<ISearchResultsProps> = ({ isListView, results, type }) => {
    if (isListView) {
        return (
            <DataTable>
                <DataTableContent>
                    <DataTableHead>
                        <DataTableRow>
                            <DataTableHeadCell>Title</DataTableHeadCell>
                            <DataTableHeadCell>Volume</DataTableHeadCell>
                            <DataTableHeadCell>Issue</DataTableHeadCell>
                            <DataTableHeadCell>Section</DataTableHeadCell>
                            <DataTableHeadCell alignEnd>Date</DataTableHeadCell>
                        </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>
                        {
                            results.map(a => a ? <ArticleListItem data={a.searchable} type={type} key={a.searchable.id} /> : null)
                        }
                    </DataTableBody>
                </DataTableContent>
            </DataTable>
        )
    }
    else return (
        <>
            {
                results.map(a => a ?
                    <div style={cardPadding} key={a.searchable.id}>
                        <ArticleCard data={a.searchable} type={type} />
                    </div>
                    : null
                )
            }
        </>
    );
}
