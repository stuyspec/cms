import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';

const USER_QUERY = gql`
query userByFirstName($slug: String!) {
    userByFirstName(first_name: $slug) {
        first_name
    }
}`;

export interface IUserData {
    first_name: string,
    last_name: string,
    email: string,
    attachment_url: string,
}

export interface IUserVariables {
    first_name: string,
    last_name: string,
    email: string,
    profile_picture: string
}

export async function queryAccountIDs(slugs: string[], client: ApolloClient<any>): Promise<number[]> {
    const results = await Promise.all(
        slugs.map(slug => client.query<IUserData, IUserVariables>({
            query: USER_QUERY,
            variables: { slug }
        }))
    );
    const userNames: number[] = [];
    results.forEach(r => {
        if (r.data && r.data.userByFirstName) {
            userNames.push(parseInt(r.data.first_name, 10));
        }
    }
    )
    return userNames;
}

export const USER_EXTENSION_INFO_FRAGMENT = gql`
fragment UserExtensionInfo on User {
    first_name
    last_name
    email
    profile_url
}`

