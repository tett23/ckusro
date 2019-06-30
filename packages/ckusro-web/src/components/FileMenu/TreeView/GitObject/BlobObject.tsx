import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { updateCurrentOid } from '../../../../modules/thunkActions';
import useTreeViewStyles from '../useTreeViewStyles';
import { InternalPath, createInternalPath } from '@ckusro/ckusro-core';

type OwnProps = {
  oid: string;
  internalPath: InternalPath;
};

type DispatchProps = {
  onClick: () => void;
};

type StyleProps = {
  fileTypeIconClass: ReturnType<typeof useTreeViewStyles>['fileTypeIcon'];
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
  const onClick = () => dispatch(updateCurrentOid(props.oid));
  const styles = useTreeViewStyles();

  return (
    <BlobObject
      {...props}
      onClick={onClick}
      fileTypeIconClass={styles.fileTypeIcon}
    />
  );
}
