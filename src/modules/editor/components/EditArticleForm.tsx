import * as React from 'react';

import { connect } from 'react-redux';

import { setUpdateArticleSucceeded } from '../actions';
import { FormStateNotification } from './FormStateNotification';

import { ArticleFormBase } from './ArticleFormBase';

import { ImageDialog } from './helpers/ImageDialog';

import gql from 'graphql-tag';
import { Query, ApolloConsumer, Mutation } from 'react-apollo';

import { stringToEditorState, editorStateToString } from '../serializeState';
import { queryAccountIDs } from '../queryHelpers';


import { schema } from '../schema';

import { withPageLayout } from '../../core/withPageLayout';
import { Button } from '@rmwc/button';

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
    $outquotes: [String!],
    $volume: Int,
    $issue: Int,
    $contributors: [Int!]!,
    $is_published: Boolean) {
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
            contributors: $contributors,
            is_published: $is_published
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
    contributors: number[],
    is_published: boolean
}

class UpdateArticleMutation extends Mutation<IData, IVariables> { }

const EditArticleUnconnected: React.FunctionComponent<any> = ({ slug, dispatch, publish }) => {
    const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
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
                                                            <FormStateNotification />
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
                                                                            is_published: publish
                                                                        }
                                                                    })
                                                                }}
                                                                postLabel="Edit"
                                                            />
                                                            <Button onClick={() => setImageDialogOpen(true)}>Upload Image</Button>
                                                            <ImageDialog 
                                                                articleId={data!.articleBySlug!.id} 
                                                                open={imageDialogOpen}
                                                                onClose={() => setImageDialogOpen(false)}
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

export const EditArticleForm = connect(null, null)(withPageLayout(EditArticleUnconnected));
