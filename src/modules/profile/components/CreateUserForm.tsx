import * as React from "react";

import { connect } from 'react-redux';

import { setCreateUserSucceeded } from '../actions';

import gql from "graphql-tag";

import { ApolloConsumer } from 'react-apollo';
import { useMutation } from 'react-apollo-hooks';

import { UserFormBase } from './UserFormBase';

import { FormStateNotification } from './FormStateNotification';

import { withPageLayout } from '../../core/withPageLayout';

const USER_MUTATION = gql`
mutation createUser(
    $first_name: String!,
    $last_name: String!,
    $email: String!,
    $password: String!,
    $password_confirmation: String!,
    $profile_picture: String
) {
    createUser(
        first_name: $first_name,
        last_name: $last_name,
        email: $email,
        password: $password,
        password_confirmation: $password_confirmation,
        profile_picture: $profile_picture
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
    password: string,
    password_confirmation: string,
    profile_url: string,
    medium_profile_url: string,
    thumb_profile_url: string
}

const intialUserState = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    profile_picture: ""
}

const CreateUserUnconnected: React.FC<any> = (props) => {
    console.log(props);
    const [createArticleMutation, {loading, error}] = useMutation(USER_MUTATION,
            {onCompleted: (data) => props.dispatch(setCreateUserSucceeded.call(true)),
            onError: (error) => props.dispatch(setCreateUserSucceeded.call(false))
    });
    return (
        <>
            <FormStateNotification />
            {(mutate) => (
                <ApolloConsumer>
                    {(client) => (
                        <UserFormBase
                            initialState={initialUserState}
                            postLabel="Create"
                            onPost={async (state) => {
                                mutate({
                                    variables: {
                                        first_name: state.first_name,
                                        last_name: state.last_name,
                                        email: state.email,
                                        password: state.password,
                                        password_confirmation: state.password,
                                        profile_picture: state.profile_picture
                                    }
                                })
                            }}
                        />
                    )}
                </ApolloConsumer>
            )}
        </>
    )
}

export const CreateUserForm = connect(null, null)(withPageLayout(CreateUserUnconnected));
                        
