import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Drawer, ListSubheader } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../modules';
import { updateIsDrawerOpen } from '../../modules/ui/fileMenu/fileMenuMisc';
import TreeView from './TreeView';
import useFileMenuStyles from './useFileMenuStyles';
import DrawerFab from './DrawerFab';

type OwnProps = {};

type StateProps = {
  isDrawerOpen: boolean;
};

type DispatchProps = {
  onClickDrawerClose: () => void;
};

type StyleProps = {
  classes: ReturnType<typeof useFileMenuStyles>;
};

export type FileMenuDrawerProps = OwnProps &
  StateProps &
  DispatchProps &
  StyleProps;

export function FileMenuDrawer({
  isDrawerOpen,
  onClickDrawerClose,
  classes,
}: FileMenuDrawerProps) {
  return (
    <div
      className={clsx(
        classes.drawer,
        isDrawerOpen ? classes.drawerOpen : classes.drawerClose,
      )}
    >
      {isDrawerOpen && (
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={isDrawerOpen}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <ListSubheader>
            Objects
            <Button onClick={onClickDrawerClose}>
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </ListSubheader>
          <TreeView />
          <DrawerFab />
        </Drawer>
      )}
    </div>
  );
}

export default function() {
  const fileMenuStyles = useFileMenuStyles();
  const stateProps = useSelector((state: State) => ({
    isDrawerOpen: state.ui.fileMenu.misc.isDrawerOpen,
  }));
  const dispatch = useDispatch();
  const dispatchProps = {
    onClickDrawerClose: () => dispatch(updateIsDrawerOpen(false)),
  };

  return (
    <FileMenuDrawer
      {...stateProps}
      {...dispatchProps}
      classes={fileMenuStyles}
    />
  );
}
