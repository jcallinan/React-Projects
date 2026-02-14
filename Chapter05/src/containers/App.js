import React, { Suspense, lazy } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Route, Switch } from 'react-router-dom';
import GlobalContext from '../context/GlobalContext';

const Header = lazy(() => import('../components/Header/Header'));
const Lists = lazy(() => import('./Lists'));
const List = lazy(() => import('./List'));
const Form = lazy(() => import('./Form'));

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const AppWrapper = styled.div`
  text-align: center;
`;

const LoadingMessage = styled.p`
  margin: 1.5rem 0;
`;

const App = () => (
  <>
    <GlobalStyle />
    <AppWrapper>
      <Suspense fallback={<LoadingMessage>Loading...</LoadingMessage>}>
        <Header />
        <GlobalContext>
          <Switch>
            <Route exact path='/' component={Lists} />
            <Route path='/list/:id/new' component={Form} />
            <Route path='/list/:id' component={List} />
          </Switch>
        </GlobalContext>
      </Suspense>
    </AppWrapper>
  </>
);

export default App;
