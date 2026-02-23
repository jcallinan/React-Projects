import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApolloClient, InMemoryCache, HttpLink, split, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import AppContainer from './AppContainer';

const API_URL = 'http://localhost:4000/graphql';
const SOCKET_URL = 'ws://localhost:4000/graphql';

const httpLink = new HttpLink({
  uri: API_URL,
});

const wsLink = new WebSocketLink({
  uri: SOCKET_URL,
  options: {
    reconnect: true,
  },
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const App = () => (
  <ApolloProvider client={client}>
    <AppContainer />
  </ApolloProvider>
);

export default App;