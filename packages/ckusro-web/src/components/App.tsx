import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import React, { useState, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import initializeStore from '../modules';
import { enablePersistedState } from '../modules/misc';
import {
  fetchHeadOids,
  fetchStageInfo,
  readPersistedState,
} from '../modules/thunkActions';
import FileMenu from './FileMenu';
import MainView from './MainView';

export function App() {
  return <Inner />;
}

export default function() {
  const store = initializeStore({});
  const theme = createMuiTheme();

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  );
}

function Inner() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await dispatch(readPersistedState());
      await dispatch(fetchHeadOids());
      await dispatch(fetchStageInfo());

      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return <div />;
  }

  dispatch(enablePersistedState());

  return (
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
  );
}
