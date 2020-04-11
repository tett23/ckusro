import {
  faChevronDown,
  faChevronRight,
  faFolder,
  faFolderOpen,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import React from 'react';
import useFileMenuStyles from '../../../useFileMenuStyles';
import { InternalPath } from '@ckusro/ckusro-core';
import EntryName from '../EntryName';

type OwnProps = {
  internalPath: InternalPath;
  isOpen: boolean;
  onClick: () => void;
  onClickSecondaryAction: () => void;
};

type StyleProps = {
  classes: ReturnType<typeof useFileMenuStyles>;
};

export type TreeNameProps = OwnProps & StyleProps & StyleProps;

export function TreeName({
  internalPath,
  isOpen,
  onClick,
  onClickSecondaryAction,
  classes,
}: TreeNameProps) {
  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon className={classes.fileTypeIcon}>
        <FolderIcon isOpen={isOpen} />
      </ListItemIcon>
      <ListItemText>
        <EntryName internalPath={internalPath} />
      </ListItemText>

      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={onClickSecondaryAction}>
          <ChevronIcon isOpen={isOpen} />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return isOpen ? <ChevronDown /> : <ChevronRight />;
}

function ChevronRight() {
  return <FontAwesomeIcon icon={faChevronRight} />;
}

function ChevronDown() {
  return <FontAwesomeIcon icon={faChevronDown} />;
}

function FolderIcon({ isOpen }: { isOpen: boolean }) {
  return isOpen ? <FolderOpened /> : <FolderClosed />;
}

function FolderOpened() {
  return <FontAwesomeIcon icon={faFolderOpen} />;
}

function FolderClosed() {
  return <FontAwesomeIcon icon={faFolder} />;
}

export default function (props: OwnProps) {
  const styleProps: StyleProps = {
    classes: useFileMenuStyles(),
  };

  return <TreeName {...props} {...styleProps} />;
}
