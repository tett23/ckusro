import React from 'react';
import ObjectMenus from './ObjectMenus';

type StyleProps = {};

export type SideMenuProps = StyleProps;

export function SideMenus(_: SideMenuProps) {
  return <ObjectMenus />;
}

export default function() {
  const styleProps: StyleProps = {};

  return <SideMenus {...styleProps} />;
}
