import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { updateCurrentOid } from '../../../modules/thunkActions';

type OwnProps = {
  oid: string;
  path: string;
};

type DispatchProps = {
  onClick: () => void;
};

export type BlobObjectProps = OwnProps & DispatchProps;

export function BlobObject({ path, onClick }: BlobObjectProps) {
  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon>
        <FontAwesomeIcon icon={faFile} />
      </ListItemIcon>
      <ListItemText primary={path} />
    </ListItem>
  );
}

export default function(props: OwnProps) {
  const dispatch = useDispatch();
  const onClick = () => dispatch(updateCurrentOid(props.oid));

  return <BlobObject {...props} onClick={onClick} />;
}
