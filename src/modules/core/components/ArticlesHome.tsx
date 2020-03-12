import * as React from 'react';
import './ArticlesHome.css';

import { Redirect } from 'react-router-dom';

import { Fab } from '@rmwc/fab';

import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';

import { ApolloConsumer } from 'react-apollo';

import { ISearchArticlesData, ISearchVariables, ARTICLE_SEARCH_QUERY } from '../queryHelpers';

import { withPageLayout } from '../withPageLayout';
import { Typography } from '@rmwc/typography';

const initialState = {
    searchQuery: "",
    redirectCreateArticle: false,
    data: undefined as ISearchArticlesData | undefined,
}

class ArticlesHomeUnconnected extends React.Component<{}, typeof initialState> {
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
            return <Redirect to="/article/new" push={true} />
        }
        return (
            <>
                <div className="ArticlesHomeContainer">
                    <ApolloConsumer>
                        {
                            (client) => {
                                return (
                                    <>
                                        <Typography use="headline1">Articles</Typography>
                                        <SearchBar
                                            onChange={this.onSearchChange}
                                            value={this.state.searchQuery}
                                            onEnter={async () => {
                                                const results = await client.query<ISearchArticlesData, ISearchVariables>({
                                                    query: ARTICLE_SEARCH_QUERY,
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
                        this.state.data ? <SearchResults results={this.state.data.searchArticles || []} type='article' /> : null
                    }
                </div>
                <div className="ArticlesHomeFab">
                    <Fab icon="add" onClick={this.onFabClick} />
                </div>
            </>
        )

    }
}

export const ArticlesHome = withPageLayout(ArticlesHomeUnconnected);
