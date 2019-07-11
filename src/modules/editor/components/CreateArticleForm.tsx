import * as React from "react";

import { connect } from 'react-redux';

import { setCreateArticleSucceeded } from '../actions';

import gql from "graphql-tag";
import { Mutation, ApolloConsumer } from 'react-apollo';

import { schema } from "../schema";
import { EditorState } from "prosemirror-state";
import { exampleSetup } from "prosemirror-example-setup";

import { editorStateToString } from '../serializeState';
import { queryAccountIDs } from '../queryHelpers';

import { ArticleFormBase } from './ArticleFormBase';

import { FormStateNotification } from './FormStateNotification';

import { withPageLayout } from '../../core/withPageLayout';


const ARTICLE_MUTATION = gql`
mutation createArticle(
    $title: String!,
    $section_id: Int!,
    $content: String!,
    $summary: String,
    $created_at: String,
    $outquotes: [String!],
    $volume: Int!,
    $issue: Int!,
    $contributors: [Int!]!) {
        createArticle(
            title: $title, 
            section_id: $section_id, 
            content: $content, 
            summary: $summary, 
            created_at: $created_at, 
            outquotes: $outquotes,
            volume: $volume,
            issue: $issue,
            contributors: $contributors
        ) {            
            id
            title
        }
    }
`;

interface IData {
    id: string,
    title: string
}

interface IVariables {
    title: string,
    section_id: number,
    content: string,
    summary?: string,
    created_at?: string,
    outquotes?: string[],
    volume: number,
    issue: number,
    contributors: number[]
}

class CreateArticleMutation extends Mutation<IData, IVariables> { };

const initialArticleState = {
    title: "",
    volume: "",
    issue: "",
    section: "",
    focus: "",
    contributors: [] as string[],
    editorState: EditorState.create(
        {
            schema,
            plugins: exampleSetup({ schema })
        }
    )
}

const CreateArticleUnconnected: React.SFC<any> = (props) => {
    return (
        <>
            <FormStateNotification />
            <CreateArticleMutation
                mutation={ARTICLE_MUTATION}
                onError={(error) => props.dispatch(setCreateArticleSucceeded.call(false))}
                onCompleted={(data) => props.dispatch(setCreateArticleSucceeded.call(true))}
            >
                {(mutate) => (
                    <ApolloConsumer>
                        {(client) => (
                            <ArticleFormBase
                                initialState={initialArticleState}
                                postLabel="Post"
                                onPost={async (state) => {
                                    const userIDs = await queryAccountIDs(state.contributors, client);
                                    mutate({
                                        variables: {
                                            title: state.title,
                                            section_id: parseInt(state.section, 10),
                                            content: editorStateToString(state.editorState),
                                            summary: state.focus,
                                            created_at: new Date().toISOString(),
                                            outquotes: [],
                                            volume: parseInt(state.volume, 10),
                                            issue: parseInt(state.issue, 10),
                                            contributors: userIDs,
                                        },
                                    });
                                }}
                            />
                        )
                        }
                    </ApolloConsumer>
                )}
            </CreateArticleMutation>
        </>
    )
}

export const CreateArticleForm = connect(null, null)(withPageLayout(CreateArticleUnconnected));

