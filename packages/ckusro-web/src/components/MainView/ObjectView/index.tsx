import React from 'react';
import Navigation from './Navigation';
import GitObject from './GitObject';
import useObjectViewStyles from './useObjectViewStyles';
import ObjectViewFab from '../ObjectViewFab';

type StyleProps = {
  classes: ReturnType<typeof useObjectViewStyles>;
};

export type ObjectViewProps = StyleProps;

export function ObjectView({ classes }: ObjectViewProps) {
  return (
    <>
      <div className={classes.navigation}>
        <Navigation />
      </div>
      <div className={classes.objectView}>
        <GitObject />
      </div>
      <ObjectViewFab />
    </>
  );
}

export default function () {
  const styleProps: StyleProps = {
    classes: useObjectViewStyles(),
  };

  return <ObjectView {...styleProps} />;
}
