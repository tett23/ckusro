import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@material-ui/core';
import useSideMenusStyles from '../../useSideMenusStyles';

type StyleProps = {
  classes: ReturnType<typeof useSideMenusStyles>;
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
    classes: useSideMenusStyles(),
  };

  return <DiffButton {...styleProps} />;
}
