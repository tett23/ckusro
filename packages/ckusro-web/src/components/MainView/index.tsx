import { Paper } from '@material-ui/core';
import React from 'react';
import MainViewComponent from './MainViewComponent';

export default function MainView() {
  return (
    <Paper style={{ padding: '2rem', width: '100%', overflowY: 'scroll' }}>
      <MainViewComponent />
    </Paper>
  );
}
