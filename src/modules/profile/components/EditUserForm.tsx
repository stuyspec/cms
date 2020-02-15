import * as React from 'react';

import { connect } from 'react-redux';

import { setUpdateUserSucceeded } from '../actions';
import { FormStateNotification } from './FormStateNotification';

import { UserFormBase } from './UserFormBase';

import gql from 'graphql-tag';
import { Query, ApolloConsumer, Mutation } from 'react-apollo';

import { stringToEditorState, editorStateToString } from '../serializeState';
import { queryAccountIDs } from '../queryHelpers';

import { schema } from '../schema';

import { withPageLayout } from '../../core/withPageLayout';

import { snackbarQueue } from '../../snackbarQueue';

const USER_QUERY = gql`
query ($slug: String!) {
    userByFirstName(first_name: $slug) {
        first_name
        last_name
        email
        profile_picture
    }
}`

interface IUserData {
    userByFirstName?: {
        first_name: string,
        last_name: string,
        email: string,
        attachment_url: string,
        medium_attachment_url: string,
        thumb_attachment_url: string,
        media_type: string
        profile_picture: string
    }
}

interface IUserVariables {
    first_name: string
}

class UserQuery extends Query<IUserData, IUserVariables> { }

const USER_MUTATION = gql`
mutation updateUser(
    $first_name: String!
    $last_name: String!,
    $email: String!,
    $profile_picture: String 
)`

interface IData {
    first_name: string,
}

interface IVariables {
    first_name: string,
    last_name: string,
    email: string,
    profile_picture: string
}

class UpdateUserMutation extends Mutation<IData, IVariables> { }

const EditUserUnconnected: React.FunctionComponent<any> = ({ first_name, dispatch }) => {
    return (
        <ApolloConsumer>
            {
                (client) => (
                    <UserQuery query={USER_QUERY} variables={{ first_name }}>
                        {
                            ({ loading, data }) => {
                                if (loading) {
                                    return "Loading"
                                }
                                if (data) {
                                    return (
                                        <UpdateUserMutation
                                            mutation={USER_MUTATION}
                                            onError={(error) => {snackbarQueue.notify({
                                                title: `Failed to update user.`, 
                                                timeout: 2000
                                            })
                                                dispatch(setUpdateUserSucceeded.call(false))
                                            }}
                                            onCompleted={(result) => {snackbarQueue.notify({
                                                title: `Successfully updated user.`, 
                                                timeout: 2000
                                            })
                                                dispatch(setUpdateUserSucceeded.call(true))
                                            }}
                                        >
                                            {
                                                (mutate) =>
                                                    (
                                                        <>
                                                            <FormStateNotification />
                                                            <UserFormBase
                                                                initialState={{
                                                                    first_name: data.userByFirstName!.first_name,
                                                                    last_name: data.userByFirstName!.last_name,
                                                                    email: data.userByFirstName!.email,
                                                                    profile_picture: data.userByFirstName!.profile_picture,
                                                                }}
                                                                onPost={async (state) => {
                                                                    mutate({
                                                                        variables: {
                                                                            first_name: data!.userByFirstName!.first_name,
                                                                            last_name: state.last_name,
                                                                            email: state.email,
                                                                            profile_picture: state.profile_picture
                                                                        }
                                                                    })
                                                                }}
                                                                postLabel="Edit"
                                                            />
                                                        </>
                                                    )
                                            }
                                        </UpdateUserMutation>
                                    )
                                }
                                if (data) {
                                    return "No user with provided slug exists."
                                }
                                return "Data error."
                            }
                        }
                    </UserQuery>
                )
            }
        </ApolloConsumer>
    )
}

export const EditUserForm = connect(null, null)(withPageLayout(EditUserUnconnected));
