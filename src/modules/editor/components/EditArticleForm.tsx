import * as React from 'react';

import { connect } from 'react-redux';

import { IState } from '../../state';
import { setUpdateArticleSucceeded } from '../actions';

import { Redirect } from 'react-router-dom';

import { ArticleFormBase } from './ArticleFormBase';

import gql from 'graphql-tag';
import { Query, ApolloConsumer, Mutation } from 'react-apollo';

import { stringToEditorState, editorStateToString } from '../serializeState';
import { queryAccountIDs } from '../queryHelpers';


import { schema } from 'prosemirror-schema-basic';

import { Snackbar } from '@rmwc/snackbar';

const ARTICLE_QUERY = gql`
query articleBySlug($slug: String!) {
    articleBySlug(slug: $slug) {
        id
        title
        content
        volume
        issue
        section {
            id
        }
        preview
        contributors {
            slug
        }
        created_at
    }
}
`

interface IArticleData {
    articleBySlug?: {
        id: string,
        title: string,
        content: string,
        volume: number,
        issue: number,
        section: {
            id: string
        },
        preview?: string,
        contributors?: Array<{
            slug: string
        }>,
        created_at?: string
    }
}

interface IArticleVariables {
    slug: string
}

class ArticleQuery extends Query<IArticleData, IArticleVariables> { }

const ARTICLE_MUTATION = gql`
mutation updateArticle(
    $id: ID!
    $title: String!,
    $section_id: Int!,
    $content: String!,
    $summary: String,
    $created_at: String,
    $outquotes: [String],
    $volume: Int,
    $issue: Int,
    $contributors: [Int]!) {
        updateArticle(
            id: $id
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
`

interface IData {
    id: string,
    title: string
}

interface IVariables {
    id: string,
    title: string,
    section_id: number,
    content: string,
    summary?: string,
    created_at?: string,
    outquotes?: string[],
    volume?: number,
    issue?: number,
    contributors: number[]
}

class UpdateArticleMutation extends Mutation<IData, IVariables> { }

const EditArticleUnconnected: React.SFC<any> = ({ slug, updateArticleSucceeded, dispatch }) => {
    if (updateArticleSucceeded) {
        return <Redirect to="/home" push={true} />
    }

    return (
        <ApolloConsumer>
            {
                (client) => (
                    <ArticleQuery query={ARTICLE_QUERY} variables={{ slug }}>
                        {
                            ({ loading, data }) => {
                                if (loading) {
                                    return "Loading"
                                }
                                if (data && data.articleBySlug) {
                                    return (
                                        <UpdateArticleMutation
                                            mutation={ARTICLE_MUTATION}
                                            onError={(error) => dispatch(setUpdateArticleSucceeded.call(false))}
                                            onCompleted={(result) => dispatch(setUpdateArticleSucceeded.call(true))}
                                        >
                                            {
                                                (mutate) =>
                                                    (
                                                        <>
                                                            <ArticleFormBase
                                                                initialState={{
                                                                    title: data!.articleBySlug!.title,
                                                                    volume: data!.articleBySlug!.volume.toString(),
                                                                    issue: data!.articleBySlug!.issue.toString(),
                                                                    section: data!.articleBySlug!.section.id.toString(),
                                                                    focus: data!.articleBySlug!.preview || "",
                                                                    contributors: data!.articleBySlug!.contributors ?
                                                                        data!.articleBySlug!.contributors!.map(c => c.slug) : [],
                                                                    editorState: stringToEditorState(data!.articleBySlug!.content, schema)
                                                                }}
                                                                onPost={async (state) => {
                                                                    const userIDs = await queryAccountIDs(state.contributors, client)
                                                                    mutate({
                                                                        variables: {
                                                                            id: data!.articleBySlug!.id,
                                                                            title: state.title,
                                                                            section_id: parseInt(state.section, 10),
                                                                            content: editorStateToString(state.editorState),
                                                                            summary: state.focus,
                                                                            created_at: data!.articleBySlug!.created_at
                                                                                || new Date().toISOString(),
                                                                            outquotes: [],
                                                                            volume: parseInt(state.volume, 10),
                                                                            issue: parseInt(state.issue, 10),
                                                                            contributors: userIDs,
                                                                        }
                                                                    })
                                                                }}
                                                                postLabel="Edit"
                                                            />
                                                            <Snackbar
                                                                show={updateArticleSucceeded === false}
                                                                onHide={() => dispatch(setUpdateArticleSucceeded.call(null))}
                                                                message="Failed to edit article."
                                                                timeout={2000}
                                                            />
                                                        </>
                                                    )
                                            }
                                        </UpdateArticleMutation>
                                    )
                                }
                                if (data) {
                                    return "No article with provided slug exists."
                                }
                                return "Data error."
                            }
                        }
                    </ArticleQuery>
                )
            }
        </ApolloConsumer>
    )
}




function mapStateToProps(state: IState) {
    return {
        updateArticleSucceeded: state.editor.updateArticleSucceeded
    }
}

export const EditArticleForm = connect(mapStateToProps, null)(EditArticleUnconnected);
