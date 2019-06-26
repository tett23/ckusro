import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { updateCurrentOid } from '../../../../modules/thunkActions';
import useTreeViewStyles from '../useTreeViewStyles';

type OwnProps = {
  oid: string;
  path: string;
};

type DispatchProps = {
  onClick: () => void;
};

type StyleProps = {
  fileTypeIconClass: ReturnType<typeof useTreeViewStyles>['fileTypeIcon'];
};

export type BlobObjectProps = OwnProps & DispatchProps & StyleProps;

export function BlobObject({
  path,
  onClick,
  fileTypeIconClass,
}: BlobObjectProps) {
  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon className={fileTypeIconClass}>
        <FontAwesomeIcon icon={faFile} />
      </ListItemIcon>
      <ListItemText primary={path} />
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
