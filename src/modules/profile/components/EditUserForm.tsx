import * as React from 'react';

import { UserFormBase } from './UserFormBase';

import gql from 'graphql-tag';
import { Query, ApolloConsumer, Mutation } from 'react-apollo';
import { Redirect } from 'react-router';

import { withPageLayout } from '../../core/withPageLayout';
import { snackbarQueue } from '../../snackbarQueue';

const USER_QUERY = gql`
query userBySlug($slug: String!) {
    userBySlug(slug: $slug) {
        id
        first_name
        last_name
        email
        profile_url
    }
}`

interface IUserData {
    userBySlug?: {
        id: string,
        first_name: string,
        last_name: string,
        email: string,
        profile_url: string,
    },
    profile_picture: string
}

interface IUserVariables {
    slug: string
}

class UserQuery extends Query<IUserData, IUserVariables> { }

const USER_MUTATION = gql`
mutation updateUser(
    $first_name: String!,
    $last_name: String!,
    $email: String!,
    $profile_picture: String,
    $id: ID!,
    ) {
        updateUser(
            id: $id,
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            profile_picture: $profile_picture,
        ) {
            id
            first_name
        }
    }
`

interface IData {
    id: string,
    first_name: string
}

interface IVariables {
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    profile_picture: string
}

class UpdateUserMutation extends Mutation<IData, IVariables> { }

const EditUserUnconnected: React.FunctionComponent<any> = ({ slug }) => {
    const [redirectTo, setRedirectTo] = React.useState(null as string | null);

    if (redirectTo !== null) {
        return <Redirect to={redirectTo} />
    }

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
                                if (data && data.userBySlug) {
                                    return (
                                        <UpdateUserMutation
                                            mutation={USER_MUTATION}
                                            onError={(error) => {
                                                snackbarQueue.notify({
                                                    title: `Failed to edit user`,
                                                    timeout: 2000
                                                })
                                            }}
                                            onCompleted={(result) => {
                                                snackbarQueue.notify({
                                                    title: `Successfully edited user`,
                                                    timeout: 2000
                                                });
                                                setRedirectTo('/users')
                                            }}
                                        >
                                            {
                                                (mutate) =>
                                                    (
                                                        <>
                                                            <UserFormBase
                                                                initialState={{
                                                                    first_name: data.userBySlug!.first_name,
                                                                    last_name: data.userBySlug!.last_name,
                                                                    email: data.userBySlug!.email,
                                                                    profile_url: data.userBySlug!.profile_url,
                                                                    password: "",
                                                                    isCreate: false,
                                                                    profile_picture: ""
                                                                }}
                                                                onPost={async (state) => {
                                                                    mutate({
                                                                        variables: {
                                                                            id: data.userBySlug!.id,
                                                                            first_name: state.first_name,
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

export const EditUserForm = withPageLayout(EditUserUnconnected);


