import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import { Provider } from 'react-redux';
import initializeStore from '../modules';
import { enablePersistedState } from '../modules/misc';
import { fetchHeadOids } from '../modules/thunkActions';
import FileMenu from './FileMenu';
import MainView from './MainView';

const store = initializeStore({});

export default function App() {
  store.dispatch(enablePersistedState());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store.dispatch(fetchHeadOids() as any);

  const theme = createMuiTheme();

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Provider store={store as any}>
      <ThemeProvider theme={theme}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <FileMenu />
          <MainView />
        </div>
      </ThemeProvider>
    </Provider>
  );
}
