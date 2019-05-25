import React from 'react';
import { Text, View } from 'react-native';
import { Provider } from 'react-redux';
import initializeStore from '../modules';
import FileView from './FileView';
import TreeView from './TreeView';

export default function App() {
  const store = initializeStore({});

  const eventsWorker = new Worker('../workers/events.ts');
  eventsWorker.addEventListener('message', (message: MessageEvent) => {
    console.log('on message', message);
  });
  eventsWorker.addEventListener('error', (err: ErrorEvent) => {
    console.log('on error', err);
  });
  eventsWorker.postMessage('hoge');

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
