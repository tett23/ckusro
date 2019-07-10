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

type OwnProps = {
  path: string;
  isOpen: boolean;
  onClick: () => void;
  onClickSecondaryAction: () => void;
};

type StyleProps = {
  fileTypeIconClass: ReturnType<typeof useFileMenuStyles>['fileTypeIcon'];
};

export type TreeNameProps = OwnProps & StyleProps;

export function TreeName({
  path,
  isOpen,
  onClick,
  onClickSecondaryAction,
  fileTypeIconClass,
}: TreeNameProps) {
  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon className={fileTypeIconClass}>
        <FolderIcon isOpen={isOpen} />
      </ListItemIcon>
      <ListItemText primary={path} />
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

export default function(props: OwnProps) {
  const styles = useFileMenuStyles();

  return <TreeName {...props} fileTypeIconClass={styles.fileTypeIcon} />;
}
