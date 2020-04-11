import React from 'react';
import useSideMenusStyles from '../useSideMenusStyles';
import SidebarButton from './Buttons/SidebarButton';

type StyleProps = {
  classes: ReturnType<typeof useSideMenusStyles>;
};

export type ObjectMenusProps = StyleProps;

export function ObjectMenus({ classes }: StyleProps) {
  return (
    <div className={classes.menuWrapper}>
      <SidebarButton />
    </div>
  );
}

export default function () {
  const styleProps: StyleProps = {
    classes: useSideMenusStyles(),
  };

  return <ObjectMenus {...styleProps} />;
}
