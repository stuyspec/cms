import * as React from 'react';
import './ArticlesHome.css';

import { Redirect } from 'react-router-dom';

import { Fab } from '@rmwc/fab';
//import { CircularProgress } from '@rmwc/circular-progress'

import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';

import gql from 'graphql-tag';
import { ApolloConsumer } from 'react-apollo';

interface IData {
    searchArticles: Array<({
        id: string,
    } | undefined)>
}

interface IVariables {
    query: string
}

const SEARCH_QUERY = gql`
query SearchQuery($query: String!) {
    searchArticles(query: $query) {
        id
    }
}`

const initialState = {
    searchQuery: "",
    redirectCreateArticle: false,
    data: undefined as IData | undefined,
}

export class ArticlesHome extends React.Component<{}, typeof initialState> {
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
                                    <SearchBar
                                        onChange={this.onSearchChange}
                                        value={this.state.searchQuery}
                                        onEnter={async () => {
                                            const results = await client.query<IData, IVariables>({
                                                query: SEARCH_QUERY,
                                                variables: {
                                                    query: this.state.searchQuery
                                                }
                                            })
                                            this.setState({
                                                data: results.data
                                            })
                                        }}
                                    />
                                )
                            }
                        }
                    </ApolloConsumer>
                    {
                        this.state.data ? <SearchResults results={this.state.data.searchArticles} /> : undefined
                    }
                </div>
                <div className="ArticlesHomeFab">
                    <Fab icon="add" onClick={this.onFabClick} />
                </div>
            </>
        )

    }
}