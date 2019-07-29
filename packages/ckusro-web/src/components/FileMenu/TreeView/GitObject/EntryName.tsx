import { Typography } from '@material-ui/core';
import React from 'react';
import { MergedPathManagerFlags } from '../../../../models/FilesStatus';
import useFileMenuStyles from '../../useFileMenuStyles';
import { InternalPath, createInternalPath } from '@ckusro/ckusro-core';
import { State } from '../../../../modules';
import { useSelector } from 'react-redux';
import { createRepositoriesManager } from '../../../../models/RepositoriesManager';

type OwnProps = {
  internalPath: InternalPath;
};

type StateProps = {
  status: MergedPathManagerFlags | null;
};

type StyleProps = {
  classes: ReturnType<typeof useFileMenuStyles>;
};

type EntryNameProps = OwnProps & StateProps & StyleProps;

export function EntryName({ internalPath, status, classes }: EntryNameProps) {
  return (
    <Typography variant="body2" className={textClass(classes, status)}>
      {createInternalPath(internalPath).basename()}
    </Typography>
  );
}

export default function(props: OwnProps) {
  const { entryStatus } = useSelector((state: State) => ({
    entryStatus: createRepositoriesManager(
      state.domain.repositories,
    ).entryStatus(props.internalPath),
  }));
  const styleProps: StyleProps = {
    classes: useFileMenuStyles(),
  };
  const stateProps: StateProps = {
    status: entryStatus == null ? null : entryStatus.flag,
  };

  return <EntryName {...props} {...stateProps} {...styleProps} />;
}

function textClass(
  classes: ReturnType<typeof useFileMenuStyles>,
  status: MergedPathManagerFlags | null,
) {
  switch (status) {
    case 'added':
      return classes.addedText;
    case 'changed':
      return classes.changedText;
    case 'deleted':
      return classes.deletedText;
    case 'nochanged':
      return classes.noChangedText;
    default:
      return classes.noChangedText;
  }
}
