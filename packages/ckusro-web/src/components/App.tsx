import React from 'react';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import initializeStore from '../modules';
import { enablePersistedState } from '../modules/misc';
import { fetchHeadOids } from '../modules/thunkActions';
import GitObjectList from './GitObjectList';
import ObjectView from './ObjectView';
import { View } from './shared';
import styled, { ThemeProvider } from './styled';
import TreeView from './TreeView';

const store = initializeStore({});

export default function App() {
  store.dispatch(enablePersistedState());
  store.dispatch(fetchHeadOids() as any);

  return (
    <Provider store={store}>
      <GlobalStyle />
      <ThemeProvider theme={{ colors: store.getState().config.colorScheme }}>
        <AppBackground>
          <TreeView />
          <GitObjectList />
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

const AppBackground = styled(View)`
  flex: 1;
  flex-direction: row;
  flex-basis: 100%;
  background-color: ${(props) => {
    return `#${props.theme.colors.background.toString(16)}`;
  }};
  overflow: hidden;
  width: 100vw;
  height: 100vh;
`;
