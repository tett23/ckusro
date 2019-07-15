import { Paper } from '@material-ui/core';
import React from 'react';
import MainViewComponent from './MainViewComponent';
import ObjectViewFab from './ObjectViewFab';

export default function MainView() {
  return (
    <Paper
      style={{
        width: '100%',
        height: '100vh',
        overflowY: 'scroll',
      }}
    >
      <div style={{ height: 'calc(100% - 2rem)', padding: '2rem' }}>
        <MainViewComponent />
      </div>
      <ObjectViewFab />
    </Paper>
  );
}
