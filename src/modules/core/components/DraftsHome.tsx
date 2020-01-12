import * as React from 'react';

import { Redirect } from 'react-router-dom';

import { Fab } from '@rmwc/fab';
import { Snackbar } from '@rmwc/snackbar';
import { Typography } from '@rmwc/typography';
import { snackbarQueue } from '../../snackbarQueue';

import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';

import { ApolloConsumer } from 'react-apollo';

import { connect } from 'react-redux';

import { IState } from '../../state';
import { setCreateArticleSucceeded, setUpdateArticleSucceeded } from '../../editor/actions';

import { ISearchDraftsData, ISearchVariables, DRAFT_SEARCH_QUERY } from '../queryHelpers';

import { withPageLayout } from '../withPageLayout';

const initialState = {
    searchQuery: "",
    redirectCreateArticle: false,
    data: undefined as ISearchDraftsData | undefined,
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
        if (this.props.createArticleSucceeded) {
            snackbarQueue.notify({
                title:'The draft was successfully created.',
                onClose:() => this.props.dispatch(setCreateArticleSucceeded.call(null)),
                timeout:2000
            })
        }
        else if (this.props.updateArticleSucceeded) {
            snackbarQueue.notify({
                title:'The draft was successfully updated.',
                onClose:() => this.props.dispatch(setUpdateArticleSucceeded.call(null)),
                timeout:2000
            })
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

function mapStateToProps(state: IState) {
    return {
        createArticleSucceeded: state.editor.createArticleSucceeded,
        updateArticleSucceeded: state.editor.updateArticleSucceeded
    }
}

export const DraftsHome = connect(mapStateToProps, null)(withPageLayout(ArticlesHomeUnconnected));
