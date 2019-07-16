import React from 'react';
import ObjectMenus from './ObjectMenus';
import WindowMenus from './WindowMenus';
import useSideMenusStyles from './useSideMenusStyles';

type StyleProps = {
  classes: ReturnType<typeof useSideMenusStyles>;
};

export type SideMenuProps = StyleProps;

export function SideMenus({ classes }: SideMenuProps) {
  return (
    <div className={classes.wrapper}>
      <ObjectMenus />
      <WindowMenus />
    </div>
  );
}

export default function() {
  const styleProps: StyleProps = {
    classes: useSideMenusStyles(),
  };

  return <SideMenus {...styleProps} />;
}
