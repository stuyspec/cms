import { STUY_SPEC_API_URL } from './constants';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';

import { store } from './store';
//import { setSession } from './accounts/actions';

const httpLink = new HttpLink({ uri: `${STUY_SPEC_API_URL}/graphql` });

//sets headers of queries and mutations for authentication
const authMiddleWare = new ApolloLink((operation, forward) => {
    const session = store.getState().accounts.session;
    console.log("Sessions: (from apolloClient)");
    console.dir(session);
    if (session) {
        operation.setContext({
            headers: {
                'access-token': session['access-token'] || null,
                client: session.client,
                uid: session.uid,
                expiry: session.expiry,
            }
        });
    }

    if (forward) {
        return forward(operation);
    }

    return null;
})

//currently disabled: server keeps tokens static until expiration

// //gets response headers and updates auth headers/session accordingly
// const addToken = new ApolloLink((operation, forward) => {
//     if (forward) {
//         return forward(operation).map((response) => {
//             console.dir(operation.getContext());
//             const context = operation.getContext();
//             store.dispatch(setSession.call(context.headers || null));
//             return response;
//         })
//     }
//     return null;
// })

//adapted from https://www.apollographql.com/docs/react/features/error-handling.html
//logs execution and network errors encountered while executing a request
const logErrors = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
        console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
    );
    }
    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
    }
});

export const client = new ApolloClient({
    link: ApolloLink.from([authMiddleWare, logErrors, httpLink]),
    cache: new InMemoryCache()
});
