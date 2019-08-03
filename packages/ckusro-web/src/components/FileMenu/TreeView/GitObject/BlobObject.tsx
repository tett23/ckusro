import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { updateByBufferInfo } from '../../../../modules/thunkActions';
import { InternalPath } from '@ckusro/ckusro-core';
import { createBufferInfo } from '../../../../models/BufferInfo';
import useFileMenuStyles from '../../useFileMenuStyles';
import EntryName from './EntryName';

type OwnProps = {
  oid: string;
  internalPath: InternalPath;
};

type DispatchProps = {
  onClick: () => void;
};

type StyleProps = {
  classes: ReturnType<typeof useFileMenuStyles>;
};

export type BlobObjectProps = OwnProps & DispatchProps & StyleProps;

export function BlobObject({
  internalPath,
  onClick,
  classes,
}: BlobObjectProps) {
  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon className={classes.fileTypeIcon}>
        <FontAwesomeIcon icon={faFile} />
      </ListItemIcon>
      <ListItemText>
        <EntryName internalPath={internalPath} />
      </ListItemText>
    </ListItem>
  );
}

export default function(props: OwnProps) {
  return <BlobObject {...buildBlobObjectProps(props)} />;
}

function buildBlobObjectProps(props: OwnProps) {
  const dispatch = useDispatch();
  const dispatchProps = {
    onClick: () =>
      dispatch(
        updateByBufferInfo(
          createBufferInfo('blob', props.oid, props.internalPath),
        ),
      ),
  };
  const styleProps: StyleProps = {
    classes: useFileMenuStyles(),
  };

  return {
    ...props,
    ...dispatchProps,
    ...styleProps,
  };
}
