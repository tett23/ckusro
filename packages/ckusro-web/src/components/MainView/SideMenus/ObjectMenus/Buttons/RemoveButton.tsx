import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@material-ui/core';
import useObjectMenusStyles from '../useObjectMenusStyles';

type StyleProps = {
  classes: ReturnType<typeof useObjectMenusStyles>;
};

export type RemoveButtonProps = StyleProps;

export function RemoveButton({ classes }: RemoveButtonProps) {
  return (
    <Icon className={classes.iconWrapper}>
      <FontAwesomeIcon icon={faTrashAlt} className={classes.icon} />
    </Icon>
  );
}

export default function() {
  const styleProps: StyleProps = {
    classes: useObjectMenusStyles(),
  };

  return <RemoveButton {...styleProps} />;
}
