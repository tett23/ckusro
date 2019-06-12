import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import initializeStore from '../modules';
import { fetchHeadOids } from '../modules/thunkActions';
import ObjectView from './ObjectView';
import styled, { ThemeProvider } from './styled';
import TreeView from './TreeView';

export default function App() {
  const store = initializeStore({});

  store.dispatch(fetchHeadOids() as any);

  return (
    <Provider store={store}>
      <ThemeProvider theme={{ colors: store.getState().config.colorScheme }}>
        <AppBackground>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TreeView />
            <ObjectView />
          </View>
        </AppBackground>
      </ThemeProvider>
    </Provider>
  );
}

const AppBackground = styled.View`
  background-color: ${(props: any) => props.theme.colors.background};
  flex: 1;
  flex-direction: row;
`;
