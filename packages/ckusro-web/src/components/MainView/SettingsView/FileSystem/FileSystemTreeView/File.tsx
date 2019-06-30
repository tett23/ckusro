import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { basename } from 'path';

type OwnProps = {
  path: string;
  onClick: (value: string | null) => void;
};

type StateProps = {};

type DispatchProps = {};

type StyleProps = {};

export type FileSystemTreeViewProps = OwnProps &
  StateProps &
  DispatchProps &
  StyleProps;

export default function FileSystemTreeView({
  path,
  onClick,
}: FileSystemTreeViewProps) {
  return (
    <ListItem button onClick={() => onClick(path)}>
      <ListItemIcon>
        <FontAwesomeIcon icon={faFile} />
      </ListItemIcon>
      <ListItemText primary={basename(path)} />
    </ListItem>
  );
}
