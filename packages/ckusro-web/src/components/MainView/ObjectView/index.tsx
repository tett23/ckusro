import React from 'react';
import Navigation from './Navigation';
import GitObject from './GitObject';

export default function ObjectView() {
  return (
    <>
      <div style={{ position: 'sticky' }}>
        <Navigation />
      </div>
      <GitObject />
    </>
  );
}
