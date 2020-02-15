import * as React from "react";

import { connect } from 'react-redux';

import { setCreateUserSucceeded } from '../actions';

import gql from "graphql-tag";
import { Mutation, ApolloConsumer } from 'react-apollo';

import { schema } from "../schema";
import { EditorState } from "prosemirror-state";
import { exampleSetup } from "prosemirror-example-setup";

import { editorStateToString } from '../serializeState';
import { queryAccountIDs } from '../queryHelpers';

import { UserFormBase } from './UserFormBase';

import { FormStateNotification } from './FormStateNotification';
import { snackbarQueue } from '../../snackbarQueue';

import { withPageLayout } from '../../core/withPageLayout';


const USER_MUTATION = gql`
mutation createUser(
    $first_name: String!,
    $last_name: Int!,
    $email: String!
    )
`;

interface IData {
    first_name: string,
    last_name: string,
    email: string,
    profile_picture: string
}

class CreateUserMutation extends Mutation<IData> { };

const initialUserState = {
    first_name: "",
    last_name: "",
    email: "",
    profile_picture: ""
}

const CreateUserUnconnected: React.FC<any> = (props) => {
    console.log(props)
    return (
        <>
            <FormStateNotification />
            <CreateUserMutation
                mutation={USER_MUTATION}
                onError={(error) => {snackbarQueue.notify({
                        title: `Failed to create user.`, 
                        timeout: 2000
                    })
                    props.dispatch(setCreateUserSucceeded.call(false))
                }}
                onCompleted={(data) => {snackbarQueue.notify({
                        title: `Successfully created user.`, 
                        timeout: 2000
                    })
                    props.dispatch(setCreateUserSucceeded.call(true))
                }}
            >
                {(mutate) => (
                    <ApolloConsumer>
                        {(client) => (
                            <UserFormBase
                                initialState={initialUserState}
                                postLabel="Post"
                                onPost={async (state) => {
                                    mutate({
                                        variables: {
                                            first_name: state.first_name,
                                            last_name: state.last_name,
                                            email: state.email,
                                            profile_picture: state.profile_picture
                                        },
                                    });
                                }}
                            />
                        )
                        }
                    </ApolloConsumer>
                )}
            </CreateUserMutation>
        </>
    )
}

export const CreateUserForm = connect(null, null)(withPageLayout(CreateUserUnconnected));
