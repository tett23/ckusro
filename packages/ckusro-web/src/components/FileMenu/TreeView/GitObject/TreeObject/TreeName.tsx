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
import useTreeViewStyles from '../../useTreeViewStyles';

type OwnProps = {
  path: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onClick: () => void;
};

type StyleProps = {
  fileTypeIconClass: ReturnType<typeof useTreeViewStyles>['fileTypeIcon'];
};

export type TreeNameProps = OwnProps & StyleProps;

export function TreeName({
  path,
  isOpen,
  setIsOpen,
  onClick,
  fileTypeIconClass,
}: TreeNameProps) {
  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon className={fileTypeIconClass}>
        <FolderIcon isOpen={isOpen} />
      </ListItemIcon>
      <ListItemText primary={path} />
      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={() => setIsOpen(!isOpen)}>
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
  const styles = useTreeViewStyles();

  return <TreeName {...props} fileTypeIconClass={styles.fileTypeIcon} />;
}
