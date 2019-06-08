import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import initializeStore from '../modules';
import ObjectView from './ObjectView';
import TreeView from './TreeView';

export default function App() {
  const store = initializeStore({});

  return (
    <Provider store={store}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TreeView />
        <ObjectView />
      </View>
    </Provider>
  );
}
