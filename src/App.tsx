import 'material-components-web/dist/material-components-web.min.css';

import * as React from 'react';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { client } from './modules/apolloClient';

import { RoutingApp } from './modules/RoutingApp';
import { store } from './modules/store';


class App extends React.Component {
  public render() {
    return (
      <div>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <RoutingApp />
          </ApolloProvider>
        </Provider>
      </div>
    );
  }
}

export default App;
