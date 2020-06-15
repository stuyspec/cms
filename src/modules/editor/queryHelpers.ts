import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';

const USER_QUERY = gql`
query userIDBySlug($slug: String!) {
    userBySlug(slug: $slug) {
        id
    }
}`;

const SECTION_QUERY = gql`
query sectionIDBySlug($slug: String!) {
    sectionBySlug(slug: $slug) {
        id
    }
}`;

interface IUserData {
    userBySlug?: {
        id: string
    }
}

interface IUserVariables {
    slug: string
}

interface ISectionData {
    sectionBySlug?: {
        id: string
    }
}

interface ISectionVariables {
    slug: string
}

export async function queryAccountIDs(slugs: string[], client: ApolloClient<any>): Promise<number[]> {
    const results = await Promise.all(
        slugs.map(slug => client.query<IUserData, IUserVariables>({
            query: USER_QUERY,
            variables: { slug }
        }))
    );
    const userIDs: number[] = [];
    results.forEach(r => {
        if (r.data && r.data.userBySlug) {
            userIDs.push(parseInt(r.data.userBySlug.id, 10));
        }
    }
    )
    return userIDs;
}

export async function querySectionIDs(slugs: string[], client: ApolloClient<any>): Promise<number[]> {
    const results = await Promise.all(
        slugs.map(slug => client.query<ISectionData, ISectionVariables>({
            query: SECTION_QUERY,
            variables: { slug }
        }))
    );
    const sectionIDs: number[] = [];
    results.forEach(r => {
        if (r.data && r.data.sectionBySlug) {
            sectionIDs.push(parseInt(r.data.sectionBySlug.id, 10));
        }
    }
    )
    return sectionIDs;
}

export interface IMedium {
    id: string,
    attachment_url: string,
    medium_attachment_url: string,
    thumb_attachment_url: string,
    media_type: string,
    caption?: string,
    title: string,
    is_featured: boolean,
    user: {
        slug: string,
        first_name: string,
        last_name: string
    }
}

export interface IMediumVariables {
    title: string, 
    caption: string,
    is_featured: boolean,
    user_id: number,
    media_type: string,
    attachment_b64: string
}

export const MEDIUM_EXTENSION_INFO_FRAGMENT = gql`
fragment MediumExtensionInfo on Medium {
    id
    attachment_url
    medium_attachment_url
    thumb_attachment_url
    media_type
    caption
    title
    is_featured
    user {
        slug
        first_name
        last_name
    }
}
`

export const CREATE_MEDIUM_MUTATION = gql`
mutation createMedium(
    $title: String!, 
    $caption: String!,
    $is_featured: Boolean!,
    $user_id: Int!,
    $media_type: String!,
    $attachment_b64: String!
) {
    createMedium(
        title: $title, 
        caption: $caption,
        is_featured: $is_featured,
        user_id: $user_id,
        media_type: $media_type,
        attachment_b64: $attachment_b64
    ) {
        ...MediumExtensionInfo
    }
}
${MEDIUM_EXTENSION_INFO_FRAGMENT}
`;
