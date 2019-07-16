import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@material-ui/core';
import useObjectMenusStyles from '../useObjectMenusStyles';

type StyleProps = {
  classes: ReturnType<typeof useObjectMenusStyles>;
};

export type DiffButtonProps = StyleProps;

export function DiffButton({ classes }: DiffButtonProps) {
  return (
    <Icon className={classes.iconWrapper}>
      <FontAwesomeIcon icon={faCodeBranch} className={classes.icon} />
    </Icon>
  );
}

export default function() {
  const styleProps: StyleProps = {
    classes: useObjectMenusStyles(),
  };

  return <DiffButton {...styleProps} />;
}
