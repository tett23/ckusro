import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import initializeStore from '../modules';
import { fetchHeadOids } from '../modules/thunkActions';
import ObjectView from './ObjectView';
import TreeView from './TreeView';

export default function App() {
  const store = initializeStore({});

  store.dispatch(fetchHeadOids() as any);

  return (
    <Provider store={store}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TreeView />
        <ObjectView />
      </View>
    </Provider>
  );
}
