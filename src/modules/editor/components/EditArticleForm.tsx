import * as React from 'react';

import { connect } from 'react-redux';

import { setUpdateArticleSucceeded } from '../actions';
import { FormStateNotification } from './FormStateNotification';

import { ArticleFormBase } from './ArticleFormBase';

import gql from 'graphql-tag';
import { Query, ApolloConsumer, Mutation } from 'react-apollo';

import { stringToEditorState, editorStateToString } from '../serializeState';
import { queryAccountIDs, IMedium } from '../queryHelpers';


import { schema } from '../schema';
import { MEDIUM_EXTENSION_INFO_FRAGMENT } from '../queryHelpers';

import { withPageLayout } from '../../core/withPageLayout';

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
        media {
            ...MediumExtensionInfo
        }
    }
}
${MEDIUM_EXTENSION_INFO_FRAGMENT}
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
        created_at?: string,
        media?: IMedium[]
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
    $is_published: Boolean,
    $media_ids: [Int!]) {
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
            is_published: $is_published,
            media_ids: $media_ids
        ) {            
            id
            title
            media {
                ...MediumExtensionInfo
            }
        }
    }
    ${MEDIUM_EXTENSION_INFO_FRAGMENT}
`

interface IData {
    id: string,
    title: string,
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
    is_published: boolean,
    media_ids: number[]
}

class UpdateArticleMutation extends Mutation<IData, IVariables> { }

const EditArticleUnconnected: React.FunctionComponent<any> = ({ slug, dispatch, publish }) => {
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
                                                                    title: data.articleBySlug!.title,
                                                                    volume: data.articleBySlug!.volume.toString(),
                                                                    issue: data.articleBySlug!.issue.toString(),
                                                                    section: data.articleBySlug!.section.id.toString(),
                                                                    focus: data.articleBySlug!.preview || "",
                                                                    date: data.articleBySlug!.created_at ?? new Date().toISOString(),
                                                                    contributors: data.articleBySlug!.contributors ?
                                                                        data.articleBySlug!.contributors!.map(c => c.slug) : [],
                                                                    media: data.articleBySlug!.media ?? [],
                                                                    editorState: stringToEditorState(data!.articleBySlug!.content, schema)
                                                                }}
                                                                allowBackdate={publish}
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
                                                                            is_published: publish,
                                                                            media_ids: state.media.map(m => parseInt(m.id))
                                                                        }
                                                                    })
                                                                }}
                                                                postLabel="Edit"
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
