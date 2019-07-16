import React from 'react';
import useObjectMenusStyles from './useObjectMenusStyles';
import DiffButton from './Buttons/DiffButton';
import RemoveButton from './Buttons/RemoveButton';
import InfoButton from './Buttons/InfoButton';

type StyleProps = {
  classes: ReturnType<typeof useObjectMenusStyles>;
};

export type ObjectMenusProps = StyleProps;

export function ObjectMenus({ classes }: StyleProps) {
  return (
    <div className={classes.wrapper}>
      <InfoButton />
      <DiffButton />
      <RemoveButton />
    </div>
  );
}

export default function() {
  const styleProps: StyleProps = {
    classes: useObjectMenusStyles(),
  };

  return <ObjectMenus {...styleProps} />;
}
