import * as React from 'react';

import { ArticleFormBase } from './ArticleFormBase';

import gql from 'graphql-tag';
import { Query, ApolloConsumer, Mutation } from 'react-apollo';
import { Redirect } from 'react-router';

import { stringToEditorState, editorStateToString } from '../serializeState';
import { queryAccountIDs, IMedium, querySectionIDs } from '../queryHelpers';


import { schema } from '../schema';
import { MEDIUM_EXTENSION_INFO_FRAGMENT } from '../queryHelpers';

import { withPageLayout } from '../../core/withPageLayout';

import { snackbarQueue } from '../../snackbarQueue';

const ARTICLE_QUERY = gql`
query articleBySlug($slug: String!) {
    articleBySlug(slug: $slug) {
        id
        title
        content
        volume
        issue
        sections {
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
        sections?: Array<{
            slug: string
        }>,
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
    $section_ids: [Int!]!,
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
            section_ids: $section_ids, 
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
    section_ids: number[],
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

const EditArticleUnconnected: React.FunctionComponent<any> = ({ slug, publish }) => {
    //if null, no redirect
    //otherwise redirect to the url stored
    const [redirectTo, setRedirectTo] = React.useState(null as string | null);

    if (redirectTo !== null) {
        return <Redirect to={redirectTo} />
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
                                            onError={(error) => {
                                                snackbarQueue.notify({
                                                    title: `Failed to edit ${publish ? 'article' : 'draft'}.`,
                                                    timeout: 2000
                                                })
                                            }}
                                            onCompleted={(result) => {
                                                snackbarQueue.notify({
                                                    title: `Successfully edited ${publish ? 'article' : 'draft'}.`,
                                                    timeout: 2000
                                                });
                                                setRedirectTo(publish ? '/articles' : '')
                                            }}
                                        >
                                            {
                                                (mutate) =>
                                                    (
                                                        <>
                                                            <ArticleFormBase
                                                                initialState={{
                                                                    title: data.articleBySlug!.title,
                                                                    volume: data.articleBySlug!.volume.toString(),
                                                                    issue: data.articleBySlug!.issue.toString(),
                                                                    sections: data.articleBySlug!.sections? 
                                                                        data.articleBySlug!.sections!.map(s => s.slug) : [],
                                                                    focus: data.articleBySlug!.preview || "",
                                                                    contributors: data.articleBySlug!.contributors ?
                                                                        data.articleBySlug!.contributors!.map(c => c.slug) : [],
                                                                    media: data.articleBySlug!.media ?? [],
                                                                    editorState: stringToEditorState(data!.articleBySlug!.content, schema)
                                                                }}
                                                                onPost={async (state) => {
                                                                    const userIDs = await queryAccountIDs(state.contributors, client)
                                                                    const sectionIDs = await querySectionIDs(state.sections, client)
                                                                    mutate({
                                                                        variables: {
                                                                            id: data!.articleBySlug!.id,
                                                                            title: state.title,
                                                                            section_ids: sectionIDs,
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

export const EditArticleForm = withPageLayout(EditArticleUnconnected);
