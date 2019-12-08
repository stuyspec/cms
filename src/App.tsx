import 'material-components-web/dist/material-components-web.min.css';
import '@rmwc/data-table/data-table.css';

import * as React from 'react';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { client } from './modules/apolloClient';

import { RoutingApp } from './modules/RoutingApp';
import { store } from './modules/store';

//allow simple display of snackbars throughout app
import { SnackbarQueue } from '@rmwc/snackbar';
import { snackbarQueue } from './modules/snackbarQueue';


class App extends React.Component {
  public render() {
    return (
      <div>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <RoutingApp />
            <SnackbarQueue messages={snackbarQueue.messages} />
          </ApolloProvider>
        </Provider>
      </div>
    );
  }
}

export default App;
