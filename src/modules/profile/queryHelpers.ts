import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';

const USER_QUERY = gql`
query userIDBySlug($slug: String!) {
    userBySlug(slug: $slug) {
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

export interface IMedium {
    id: string,
    attachment_url: string,
    medium_attachment_url: string,
    thumb_attachment_url: string,
    media_type: string,
    title: string,
}

export interface IMediumVariables {
    user_id: number,
    media_type: string,
    attachment_b64: string
}

export const CREATE_MEDIUM_MUTATION = gql`
mutation createProfilePicture(
    media_type: $media_type,
    attachment_b64: $attachment_b64
)
`;
