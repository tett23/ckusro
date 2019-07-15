import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@material-ui/core';
import useObjectMenusStyles from '../useObjectMenusStyles';

type StyleProps = {
  classes: ReturnType<typeof useObjectMenusStyles>;
};

export type ObjectMenusProps = StyleProps;

export function InfoButton({ classes }: StyleProps) {
  return (
    <Icon className={classes.iconWrapper}>
      <FontAwesomeIcon icon={faInfoCircle} className={classes.icon} />
    </Icon>
  );
}

export default function() {
  const styleProps: StyleProps = {
    classes: useObjectMenusStyles(),
  };

  return <InfoButton {...styleProps} />;
}
