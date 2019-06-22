import { createMuiTheme, Theme } from '@material-ui/core';
import { styled, ThemeProvider } from '@material-ui/styles';
import React from 'react';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import initializeStore from '../modules';
import { enablePersistedState } from '../modules/misc';
import { fetchHeadOids } from '../modules/thunkActions';
import FileMenu from './FileMenu';
import ObjectView from './ObjectView';
import { View } from './shared';

const store = initializeStore({});

export default function App() {
  store.dispatch(enablePersistedState());
  store.dispatch(fetchHeadOids() as any);

  const theme = createMuiTheme();

  return (
    <Provider store={store}>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <AppBackground theme={theme}>
          <FileMenu />
          <ObjectView />
        </AppBackground>
      </ThemeProvider>
    </Provider>
  );
}

const GlobalStyle = createGlobalStyle`
  body {
    font-size: 16px;
    font-family: sans-serif;
    margin: 0;
  }
`;

const AppBackground = styled(View)(({ theme }: { theme: Theme }) => {
  return {
    flex: 1,
    flexDirection: 'row',
    flexBasis: '100%',
    backgroundColor: theme.palette.background.default,
    overflow: 'hidden',
    width: '100vw',
    height: '100vh',
  };
});
