import { Paper } from '@material-ui/core';
import React from 'react';
import MainViewComponent from './MainViewComponent';

export default function MainView() {
  return (
    <Paper style={{ width: 'auto', overflowY: 'scroll' }}>
      <MainViewComponent />
    </Paper>
  );
}
