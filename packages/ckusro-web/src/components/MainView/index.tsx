import { Paper } from '@material-ui/core';
import React from 'react';
import MainViewComponent from './MainViewComponent';

export default function MainView() {
  return (
    <Paper
      style={{
        width: '100%',
        height: '100vh',
        overflowY: 'scroll',
      }}
    >
      <div style={{ padding: '2rem' }}>
        <MainViewComponent />
      </div>
    </Paper>
  );
}
