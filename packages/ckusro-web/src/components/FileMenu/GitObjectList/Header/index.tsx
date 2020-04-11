import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../../../modules';
import { updateIsDrawerOpen } from '../../../../modules/ui/fileMenu/fileMenuMisc';
import useFileMenuStyles from '../../useFileMenuStyles';
import useGitObjectListStyles from '../useGitObjectListStyles';
import { createInternalPath } from '@ckusro/ckusro-core';

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
  classes,
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
        <Typography
          className={classes.headerText}
          variant="h6"
          align="center"
          noWrap
        >
          {headerTitle}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default function () {
  const styles = useGitObjectListStyles();
  const fileMenuStyles = useFileMenuStyles();
  const stateProps = useSelector((state: State) => {
    const bufferInfo = state.ui.fileMenu.gitObjectList.bufferInfo;
    const headerTitle =
      bufferInfo == null
        ? ''
        : createInternalPath(bufferInfo.internalPath).basename();

    return {
      isDrawerOpen: state.ui.fileMenu.misc.isDrawerOpen,
      headerTitle,
    };
  });
  const dispatch = useDispatch();
  const dispatchProps = {
    onClickDrawerOpen: () => dispatch(updateIsDrawerOpen(true)),
  };

  return (
    <Header
      {...stateProps}
      {...dispatchProps}
      classes={styles}
      fileMenuClasses={fileMenuStyles}
    />
  );
}
