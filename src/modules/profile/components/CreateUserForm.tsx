import * as React from "react";

import gql from "graphql-tag";

import { ApolloConsumer, Mutation } from 'react-apollo';

import { UserFormBase } from './UserFormBase';

import { snackbarQueue } from '../../snackbarQueue';

import { withPageLayout } from '../../core/withPageLayout';
import { Redirect } from "react-router";


const USER_MUTATION = gql`
mutation createUser(
    $first_name: String!,
    $last_name: String!,
    $email: String!,
    $password: String!,
    $password_confirmation: String!,
    $profile_picture_b64: String,
    $role: String!
) {
    createUser(
        first_name: $first_name,
        last_name: $last_name,
        email: $email,
        password: $password,
        password_confirmation: $password_confirmation,
        profile_picture_b64: $profile_picture_b64,
        role: $role
    ) {
        id
        first_name
    }
}`;

interface IData {
    id: string,
    first_name: string
}

interface IVariables {
    first_name: string,
    last_name: string,
    email: string,
    password?: string,
    password_confirmation?: string,
    role: string,
    profile_picture_b64: string
}

class CreateUserMutation extends Mutation<IData, IVariables> { };

function passwordGenerator() {
    let password = ""
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%"

    var length = charset.length

    for (var i = 0; i< 16; i++) {
        password += charset.substr(Math.floor((Math.random() * length) + 1), 1);
    }
    return password
}

const initialUserState = {
    first_name: "",
    last_name: "",
    email: "",
    password: passwordGenerator(),
    password_confirmation: "",
    isCreate: true,
    role: "",
    profile_pic_url: "",
    profile_picture_b64: ""
}

const CreateUserUnconnected: React.FC<any> = (props) => {
    const [redirectTo, setRedirectTo] = React.useState(null as string | null);

    if (redirectTo !== null) {
        return <Redirect to={redirectTo} />
    }

    return (
        <>
            <CreateUserMutation 
                mutation={USER_MUTATION}
                onError={(error) => {snackbarQueue.notify({
                    title: 'Failed to create user',
                    timeout: 2000
                    })
                }}
                onCompleted={(data) => {snackbarQueue.notify({
                    title: 'Successfully created user',
                    timeout: 2000
                    })
                    setRedirectTo('/users')
                }}
            >
                {(mutate) => (
                    <ApolloConsumer>
                        {(client) => (
                            <UserFormBase
                                initialState={initialUserState}
                                postLabel="Create"
                                onPost={async (state) => {
                                    await mutate({
                                        variables: {
                                            first_name: state.first_name,
                                            last_name: state.last_name,
                                            email: state.email,
                                            password: state.password,
                                            password_confirmation: state.password,
                                            role: state.role,
                                            profile_picture_b64: state.profile_picture_b64,
                                        }
                                    })
                                }}
                            />
                        )}
                    </ApolloConsumer>
                )}
            </CreateUserMutation>
        </>
    )
}

export const CreateUserForm = withPageLayout(CreateUserUnconnected);
                        
