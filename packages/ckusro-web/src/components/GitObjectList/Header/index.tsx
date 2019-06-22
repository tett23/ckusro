import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../../modules';
import { updateIsDrawerOpen } from '../../../modules/ui/fileMenu';
import useFileMenuStyles from '../../FileMenu/useFileMenuStyles';
import useGitObjectListStyles from '../useGitObjectListStyles';

type OwnProps = {};

type StateProps = {
  isDrawerOpen: boolean;
  headerTitle: string;
};

type DispatchProps = {
  onClickDrawerOpen: () => void;
};

type StyleProps = {
  classes: ReturnType<typeof useGitObjectListStyles>;
  fileMenuClasses: ReturnType<typeof useFileMenuStyles>;
};

export type HeaderProps = OwnProps & StateProps & DispatchProps & StyleProps;

export function Header({
  isDrawerOpen,
  headerTitle,
  onClickDrawerOpen,
  fileMenuClasses,
}: HeaderProps) {
  return (
    <AppBar position="sticky" className={fileMenuClasses.appBar}>
      <Toolbar>
        {!isDrawerOpen && (
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={onClickDrawerOpen}
            edge="start"
            className={fileMenuClasses.menuButton}
          >
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
        )}
        <Typography variant="h6" noWrap>
          {headerTitle}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default function() {
  const styles = useGitObjectListStyles();
  const fileMenuStyles = useFileMenuStyles();
  const stateProps = useSelector((state: State) => ({
    isDrawerOpen: state.ui.fileMenu.isDrawerOpen,
  }));
  const dispatch = useDispatch();
  const dispatchProps = {
    onClickDrawerOpen: () => dispatch(updateIsDrawerOpen(true)),
  };

  return (
    <Header
      {...stateProps}
      headerTitle={''}
      {...dispatchProps}
      classes={styles}
      fileMenuClasses={fileMenuStyles}
    />
  );
}
