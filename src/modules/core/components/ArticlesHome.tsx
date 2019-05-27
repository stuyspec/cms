import * as React from 'react';
import './ArticlesHome.css';

import { Redirect } from 'react-router-dom';

import { Fab } from '@rmwc/fab';
import { Snackbar } from '@rmwc/snackbar';

import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';

import gql from 'graphql-tag';
import { ApolloConsumer } from 'react-apollo';

import { connect } from 'react-redux';

import { IState } from '../../state';
import { setCreateArticleSucceeded, setUpdateArticleSucceeded } from '../../editor/actions';

import { withPageLayout } from '../withPageLayout';

interface IData {
    searchArticles: Array<({
        searchable: {
            id: string,
            title: string,
            preview?: string,
            slug: string,
            contributors?: Array<{ first_name?: string, last_name?: string, slug: string }>,
            section: { permalink: string }
        }
    } | undefined)>
}

interface IVariables {
    query: string
}

const SEARCH_QUERY = gql`
query SearchQuery($query: String!) {
    searchArticles(query: $query) {
        searchable {
            id
            title
            preview
            slug
            contributors {
                slug
                first_name
                last_name
            }
            section {
                permalink
                id
            }
        }
    }
}`

const initialState = {
    searchQuery: "",
    redirectCreateArticle: false,
    data: undefined as IData | undefined,
}

class ArticlesHomeUnconnected extends React.Component<any, typeof initialState> {
    constructor(props: Readonly<any>) {
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
                        this.state.data ? <SearchResults results={this.state.data.searchArticles} /> : null
                    }
                </div>
                <div className="ArticlesHomeFab">
                    <Fab icon="add" onClick={this.onFabClick} />
                </div>
                <Snackbar
                    open={this.props.createArticleSucceeded}
                    onClose={() => this.props.dispatch(setCreateArticleSucceeded.call(null))}
                    message="The article was successfully created."
                    timeout={2000}
                />
                <Snackbar
                    open={this.props.updateArticleSucceeded}
                    onClose={() => this.props.dispatch(setUpdateArticleSucceeded.call(null))}
                    message="The article was successfully updated."
                    timeout={2000}
                />
            </>
        )

    }
}

function mapStateToProps(state: IState) {
    return {
        createArticleSucceeded: state.editor.createArticleSucceeded,
        updateArticleSucceeded: state.editor.updateArticleSucceeded
    }
}

export const ArticlesHome = connect(mapStateToProps, null)(withPageLayout(ArticlesHomeUnconnected));