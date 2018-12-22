import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';

const USER_QUERY = gql`
query userByEmail($email: String!) {
    userByUID(uid: $email) {
        id
    }
}`;

interface IUserData {
    userByUID?: {
        id: string
    }
}

interface IUserVariables {
    email: string
}

export async function queryAccountIDs(emails: string[], client: ApolloClient<any>): Promise<number[]> {
    const results = await Promise.all(
        emails.map(email => client.query<IUserData, IUserVariables>({
            query: USER_QUERY,
            variables: { email }
        }))
    );
    const userIDs: number[] = [];
    results.forEach(r => {
        if (r.data && r.data.userByUID) {
            userIDs.push(parseInt(r.data.userByUID.id, 10));
        }
    }
    )
    return userIDs;
}