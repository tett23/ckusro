import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { updateByBufferInfo } from '../../../../modules/thunkActions';
import { InternalPath, createInternalPath } from '@ckusro/ckusro-core';
import { createBufferInfo } from '../../../../models/BufferInfo';
import useFileMenuStyles from '../../useFileMenuStyles';

type OwnProps = {
  oid: string;
  internalPath: InternalPath;
};

type DispatchProps = {
  onClick: () => void;
};

type StyleProps = {
  fileTypeIconClass: ReturnType<typeof useFileMenuStyles>['fileTypeIcon'];
};

export type BlobObjectProps = OwnProps & DispatchProps & StyleProps;

export function BlobObject({
  internalPath,
  onClick,
  fileTypeIconClass,
}: BlobObjectProps) {
  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon className={fileTypeIconClass}>
        <FontAwesomeIcon icon={faFile} />
      </ListItemIcon>
      <ListItemText primary={createInternalPath(internalPath).basename()} />
    </ListItem>
  );
}

export default function(props: OwnProps) {
  const dispatch = useDispatch();
  const dispatchProps = {
    onClick: () =>
      dispatch(
        updateByBufferInfo(
          createBufferInfo('blob', props.oid, props.internalPath),
        ),
      ),
  };
  const styles = useFileMenuStyles();

  return (
    <BlobObject
      {...props}
      {...dispatchProps}
      fileTypeIconClass={styles.fileTypeIcon}
    />
  );
}
