import { Paper } from '@material-ui/core';
import React from 'react';
import MainViewComponent from './MainViewComponent';
import ObjectViewFab from './ObjectViewFab';
import useMainViewStyles from './useMainViewStyles';
import SideMenus from './SideMenus';

type StyleProps = {
  classes: ReturnType<typeof useMainViewStyles>;
};

export type MainViewProps = StyleProps;

export function MainView({ classes }: MainViewProps) {
  return (
    <>
      <Paper className={classes.wrapper}>
        <div className={classes.contentWrapper}>
          <div className={classes.mainViewContent}>
            <MainViewComponent />
          </div>
        </div>
        <div className={classes.objectMenus}>
          <SideMenus />
        </div>
      </Paper>
      <ObjectViewFab />
    </>
  );
}

export default function() {
  const styleProps: StyleProps = {
    classes: useMainViewStyles(),
  };

  return <MainView {...styleProps} />;
}
