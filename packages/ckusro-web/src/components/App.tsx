import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import { Provider } from 'react-redux';
import initializeStore from '../modules';
import { enablePersistedState } from '../modules/misc';
import { fetchHeadOids, fetchStageInfo } from '../modules/thunkActions';
import FileMenu from './FileMenu';
import MainView from './MainView';

export default function App() {
  const store = initializeStore({});

  store.dispatch(enablePersistedState());
  store.dispatch(fetchHeadOids());
  store.dispatch(fetchStageInfo());

  const theme = createMuiTheme();

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Provider store={store as any}>
      <ThemeProvider theme={theme}>
        <div
          style={{
            display: 'flex',
            flexFlow: 'row nowrap',
            width: '100vw',
            height: '100vh',
            justifyContent: 'stretch',
            alignItems: 'stretch',
          }}
        >
          <div style={{ flexGrow: 0 }}>
            <FileMenu />
          </div>
          <div style={{ flexGrow: 3 }}>
            <MainView />
          </div>
        </div>
      </ThemeProvider>
    </Provider>
  );
}
