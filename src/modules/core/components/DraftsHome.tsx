import * as React from 'react';

import { Redirect } from 'react-router-dom';

import { Fab } from '@rmwc/fab';
import { Snackbar } from '@rmwc/snackbar';

import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';

import { ApolloConsumer } from 'react-apollo';

import { connect } from 'react-redux';

import { IState } from '../../state';
import { setCreateArticleSucceeded, setUpdateArticleSucceeded } from '../../editor/actions';

import { ISearchData, ISearchVariables, DRAFT_SEARCH_QUERY } from '../queryHelpers';

import { withPageLayout } from '../withPageLayout';

const initialState = {
    searchQuery: "",
    redirectCreateArticle: false,
    data: undefined as ISearchData | undefined,
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
            return <Redirect to="/draft/new" push={true} />
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
                                            const results = await client.query<ISearchData, ISearchVariables>({
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
                                )
                            }
                        }
                    </ApolloConsumer>
                    {
                        this.state.data ? <SearchResults results={this.state.data.searchArticles || []} /> : null
                    }
                </div>
                <div className="ArticlesHomeFab">
                    <Fab icon="add" onClick={this.onFabClick} />
                </div>
                <Snackbar
                    open={this.props.createArticleSucceeded}
                    onClose={() => this.props.dispatch(setCreateArticleSucceeded.call(null))}
                    message="The draft was successfully created."
                    timeout={2000}
                />
                <Snackbar
                    open={this.props.updateArticleSucceeded}
                    onClose={() => this.props.dispatch(setUpdateArticleSucceeded.call(null))}
                    message="The draft was successfully updated."
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

export const DraftsHome = connect(mapStateToProps, null)(withPageLayout(ArticlesHomeUnconnected));