import React from 'react';
import { Text, View } from 'react-native';
import { Provider } from 'react-redux';
import initializeStore from '../modules';
import FileView from './FileView';
import TreeView from './TreeView';

export default function App() {
  const store = initializeStore({});

  return (
    <Provider store={store}>
      <View>
        <Text>hogehoge</Text>
        <TreeView />
        <FileView />
      </View>
    </Provider>
  );
}
