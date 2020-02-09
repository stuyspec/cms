import * as React from 'react';
import './UsersHome.css';

import { Redirect } from 'react-router-dom';

import { Fab } from '@rmwc/fab';

import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';

import gql from 'graphql-tag';
import { ApolloConsumer } from 'react-apollo';

import { connect } from 'react-redux';

import { IState } from '../../state';

import { ISearchUsersData, ISearchVariables, USER_SEARCH_QUERY } from '../queryHelpers';

import { withPageLayout } from '../withPageLayout';
import { Typography } from '@rmwc/typography';

const initialState = {
    searchQuery: "",
    redirectCreateUsers: false,
    data: undefined as ISearchUsersData | undefined,
}

class UsersHomeUnconnected extends React.Component<any, typeof initialState> {
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
            redirectCreateUsers: true
        })
    }

    public render() {
        if (this.state.redirectCreateUsers) {
            return <Redirect to="/users/new" push={true} />
        }
        return (
            <>
                    <div className="UsersHomeContainer">
                    <ApolloConsumer>
                        {
                            (client) => {
                                return (
                                    <>
                                        <Typography use="headline1">Users</Typography>
                                        <SearchBar
                                            onChange={this.onSearchChange}
                                            value={this.state.searchQuery}
                                            onEnter={async () => {
                                                const results = await client.query<ISearchUsersData, ISearchVariables>({
                                                    query: USER_SEARCH_QUERY,
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
                        //this.state.data ? <SearchResults isListView={false} results={this.state.data.searchUsers || []} type='users' /> : null
                    }
                </div>
                <div className="UsersHomeFab">
                    <Fab icon="add" onClick={this.onFabClick} />
                </div>
            </>
        )

    }
}

function mapStateToProps(state: IState) {
    return {
        createUserSucceeded: state.profile.createUserSucceeded,
        updateUserSucceeded: state.profile.updateUserSucceeded
    }
}

export const UsersHome = connect(mapStateToProps, null)(withPageLayout(UsersHomeUnconnected));
