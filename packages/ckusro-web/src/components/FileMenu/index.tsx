import React from 'react';
import FileMenuDrawer from './FileMenuDrawer';
import GitObjectList from './GitObjectList';

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
