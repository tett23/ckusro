import React from 'react';
import GitObjectList from '../GitObjectList';
import FileMenuDrawer from './FileMenuDrawer';

export default function FileMenu() {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div>
          <FileMenuDrawer />
        </div>
        <div>
          <GitObjectList />
        </div>
      </div>
    </>
  );
}
