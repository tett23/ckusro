import { TreeObject as TreeObjectType } from '@ckusro/ckusro-core';
import {
  faChevronDown,
  faChevronRight,
  faFolder,
  faFolderOpen,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Collapse,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createObjectManager } from '../../../models/ObjectManager';
import { State } from '../../../modules';
import { updateCurrentOid } from '../../../modules/thunkActions';
import FetchObjects from '../../FetchObject';
import { TreeEntries } from '../TreeEntries';

type OwnProps = {
  oid: string;
  path: string;
};

type StateProps = {
  treeObject: TreeObjectType;
};

type DispatchProps = {
  onClick: () => void;
};

export type TreeObjectProps = OwnProps & StateProps & DispatchProps;

export function TreeObject({
  path,
  onClick,
  treeObject: { content },
}: TreeObjectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TreeName
        path={path}
        onClick={onClick}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <TreeEntries treeEntries={!isOpen ? [] : content} />
      </Collapse>
    </>
  );
}

type TreeNameProps = {
  path: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onClick: () => void;
};

function TreeName({ path, isOpen, setIsOpen, onClick }: TreeNameProps) {
  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon>
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
  const { oid } = props;

  const dispatch = useDispatch();
  const onClick = () => dispatch(updateCurrentOid(oid));

  const gitObject = useSelector((state: State) =>
    createObjectManager(state.domain.objectManager).fetch<TreeObjectType>(oid),
  );
  if (gitObject == null) {
    return <FetchObjects oids={[oid]} />;
  }

  return <TreeObject {...props} treeObject={gitObject} onClick={onClick} />;
}
