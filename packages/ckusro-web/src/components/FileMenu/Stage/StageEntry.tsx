import React from 'react';
import {
  BlobTreeEntry,
  InternalPath,
  createInternalPath,
} from '@ckusro/ckusro-core';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import useFileMenuStyles from '../useFileMenuStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { updateByBufferInfo } from '../../../modules/thunkActions';
import { createBufferInfo } from '../../../models/BufferInfo';
import { State, Actions } from '../../../modules';

type OwnProps = {
  internalPath: InternalPath;
  blobEntry: BlobTreeEntry;
};

type StateProps = {};

type DispatchProps = {
  onClick: () => void;
};

type StyleProps = {
  classes: ReturnType<typeof useFileMenuStyles>;
};

export type StageEntryProps = OwnProps &
  StateProps &
  DispatchProps &
  StyleProps;

export function StageEntry({
  internalPath,
  onClick,
  classes,
}: StageEntryProps) {
  return (
    <ListItem dense button onClick={onClick}>
      <ListItemIcon className={classes.fileTypeIcon}>
        <FontAwesomeIcon icon={faFile} />
      </ListItemIcon>
      <ListItemText primary={createInternalPath(internalPath).basename()} />
    </ListItem>
  );
}

const Memoized = React.memo(
  StageEntry,
  (prev, next) =>
    createInternalPath(prev.internalPath).compareInternalPath(
      next.internalPath,
    ) && prev.blobEntry.oid === next.blobEntry.oid,
);

export default function (props: OwnProps) {
  const dispatch: ThunkDispatch<State, unknown, Actions> = useDispatch();
  const dispatchProps: DispatchProps = {
    onClick: () => {
      dispatch(
        updateByBufferInfo(
          createBufferInfo('blob', props.blobEntry.oid, props.internalPath),
        ),
      );
    },
  };
  const styleProps = { classes: useFileMenuStyles() };

  return <Memoized {...props} {...dispatchProps} {...styleProps} />;
}
