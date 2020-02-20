import * as React from 'react';

import { Redirect } from 'react-router-dom';

import { Fab } from '@rmwc/fab';
import { Typography } from '@rmwc/typography';

import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';

import { ApolloConsumer } from 'react-apollo';

import { ISearchDraftsData, ISearchVariables, DRAFT_SEARCH_QUERY } from '../queryHelpers';

import { withPageLayout } from '../withPageLayout';

const initialState = {
    searchQuery: "",
    redirectCreateArticle: false,
    data: undefined as ISearchDraftsData | undefined,
}

class DraftsHomeUnconnected extends React.Component<{}, typeof initialState> {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = initialState;
    }

    public onSearchChange = (searchQuery: string) => {
        this.setState({
            searchQuery
        })
    }

    public onFabClick = () => {
        this.setState({
            redirectCreateArticle: true
        })
    }

    public render() {
        if (this.state.redirectCreateArticle) {
            return <Redirect to="/draft/new" push={true} />
        }
        return (
            <>
                <div className="ArticlesHomeContainer">
                    <ApolloConsumer>
                        {
                            (client) => {
                                return (
                                    <>
                                        <Typography use="headline1">Drafts</Typography>
                                        <SearchBar
                                            onChange={this.onSearchChange}
                                            value={this.state.searchQuery}
                                            onEnter={async () => {
                                                const results = await client.query<ISearchDraftsData, ISearchVariables>({
                                                    query: DRAFT_SEARCH_QUERY,
                                                    variables: {
                                                        query: this.state.searchQuery
                                                    }
                                                })
                                                this.setState({
                                                    data: results.data
                                                })
                                            }}
                                        />
                                    </>
                                )
                            }
                        }
                    </ApolloConsumer>
                    {
                        this.state.data ? <SearchResults results={this.state.data.searchUnpublishedArticles || []} type={'draft'} /> : null
                    }
                </div>
                <div className="ArticlesHomeFab">
                    <Fab icon="add" onClick={this.onFabClick} />
                </div>
            </>
        )

    }
}

export const DraftsHome = withPageLayout(DraftsHomeUnconnected);
