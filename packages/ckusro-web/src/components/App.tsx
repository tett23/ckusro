import React from 'react';
import { Provider } from 'react-redux';
import initializeStore from '../modules';
import { fetchHeadOids } from '../modules/thunkActions';
import GitObjectList from './GitObjectList';
import ObjectView from './ObjectView';
import styled, { StyledProps, ThemeProvider } from './styled';
import TreeView from './TreeView';

export default function App() {
  const store = initializeStore({});

  store.dispatch(fetchHeadOids() as any);

  return (
    <Provider store={store}>
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

const AppBackground = styled.View`
  flex: 1;
  flex-direction: row;
  flex-basis: 100%;
  background-color: ${(props: StyledProps) => {
    return `#${props.theme.colors.background.toString(16)}`;
  }};
  overflow: hidden;
  width: 100vw;
  height: 100vh;
`;
