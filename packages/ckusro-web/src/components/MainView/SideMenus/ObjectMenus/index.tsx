import React from 'react';
import useSideMenusStyles from '../useSideMenusStyles';
import DiffButton from './Buttons/DiffButton';
import RemoveButton from './Buttons/RemoveButton';
import InfoButton from './Buttons/InfoButton';

type StyleProps = {
  classes: ReturnType<typeof useSideMenusStyles>;
};

export type ObjectMenusProps = StyleProps;

export function ObjectMenus({ classes }: StyleProps) {
  return (
    <div className={classes.menuWrapper}>
      <InfoButton />
      <DiffButton />
      <RemoveButton />
    </div>
  );
}

export default function () {
  const styleProps: StyleProps = {
    classes: useSideMenusStyles(),
  };

  return <ObjectMenus {...styleProps} />;
}
