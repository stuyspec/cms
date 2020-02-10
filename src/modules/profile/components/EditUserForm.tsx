import * as React from 'react';

import { connect } from 'react-redux';

import { setUpdateUserSucceeded } from '../actions';
import { FormStateNotification } from './FormStateNotification';

import { UserFormBase } from './UserFormBase';

import gql from 'graphql-tag';
import { Query, ApolloConsumer, Mutation } from 'react-apollo';

import { stringToEditorState, editorStateToString } from '../serializeState';
import { queryAccountIDs, IMedium } from '../queryHelpers';

import { schema } from '../schema';

import { withPageLayout } from '../../core/withPageLayout';

import { snackbarQueue } from '../../snackbarQueue';

const USER_QUERY = gql`
query ($slug: String!) {
    userByFirstName(first_name: $slug) {
        first_name
        last_name
        email
        profile_picture_file_name
        profile_picture_content_type
        profile_picture_file_size
        profile_picture_updated_at
    }
}`

interface IUserData {
    userByFirstName?: {
        first_name: string,
        last_name: string,
        email: string,
        profile_picture_updated_at?: string
    }
}

interface IUserVariables {
    slug: string
}

class UserQuery extends Query<IUserData, IUserVariables> { }

const USER_MUTATION = gql`
mutation updateUser(
    $first_name: String!
    $last_name: String!,
    $email: String!,
    $profile_picture_file_name: String,
    $profile_picture_content_type: String,
    $profile_picture_file_size: String,
    $profile_picture_updated_at: String,
)`

interface IData {
    first_name: string,
}

interface IVariables {
    first_name: string,
    last_name: string,
    email: string,
    profile_picture_file_name?: string,
    profile_picture_content_type?: string,
    profile_picture_file_size?: string,
    profile_picture_updated_at?: string,
}

class UpdateUserMutation extends Mutation<IData, IVariables> { }

const EditUserUnconnected: React.FunctionComponent<any> = ({ slug, dispatch, publish }) => {
    return (
        <ApolloConsumer>
            {
                (client) => (
                    <UserQuery query={USER_QUERY} variables={{ slug }}>
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
                                                title: `Failed to create ${publish ? 'user' : 'draft'}.`, 
                                                timeout: 2000
                                            })
                                                dispatch(setUpdateUserSucceeded.call(false))
                                            }}
                                            onCompleted={(result) => {snackbarQueue.notify({
                                                title: `Successfully created ${publish ? 'user' : 'draft'}.`, 
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
                                                                    media: data.userByFirstName!.attachment,
                                                                }}
                                                                onPost={async (state) => {
                                                                    mutate({
                                                                        variables: {
                                                                            first_name: data!.userByFirstName!.first_name,
                                                                            last_name: state.last_name,
                                                                            email: state.email,
                                                                            media: state.media
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
