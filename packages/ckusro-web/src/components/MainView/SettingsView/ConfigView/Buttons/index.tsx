import React from 'react';
import ClearStageButton from './ClearStageButton';
import RemoveAllRepositoriesButton from './RemoveAllRepositoriesButton';
import InitializePersistedStateButton from './InitializePersistedStateButton';
import useButtonsStyles from './useButtonsStyles';

type StyleProps = {
  classes: ReturnType<typeof useButtonsStyles>;
};

export type ButtonsProps = StyleProps;

export function Buttons({ classes }: StyleProps) {
  return (
    <div className={classes.container}>
      <ClearStageButton />
      <RemoveAllRepositoriesButton />
      <InitializePersistedStateButton />
    </div>
  );
}

export default function () {
  const styleProps: StyleProps = {
    classes: useButtonsStyles(),
  };

  return <Buttons {...styleProps} />;
}
