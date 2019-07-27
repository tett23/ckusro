import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faColumns } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@material-ui/core';
import useSideMenusStyles from '../../useSideMenusStyles';

type StyleProps = {
  classes: ReturnType<typeof useSideMenusStyles>;
};

export type SidebarButton = StyleProps;

export function SidebarButton({ classes }: SidebarButton) {
  return (
    <Icon className={classes.iconWrapper}>
      <FontAwesomeIcon icon={faColumns} className={classes.icon} />
    </Icon>
  );
}

export default function() {
  const styleProps: StyleProps = {
    classes: useSideMenusStyles(),
  };

  return <SidebarButton {...styleProps} />;
}
