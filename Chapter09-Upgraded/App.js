import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppContextProvider from './context/AppContext';
import AppContainer from './AppContainer';

const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <AppContextProvider>
      <AppContainer />
    </AppContextProvider>
  </GestureHandlerRootView>
);

export default App;
