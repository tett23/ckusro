import { TreeEntry } from '@ckusro/ckusro-core';
import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateCurrentOid } from '../../../modules/thunkActions';
import FetchObject from '../../FetchObject';
import TreeObject from '../GitObject/TreeObject';

type OwnProps = {
  treeEntry: TreeEntry;
};

type DispatchProps = {
  onPress: (oid: string) => void;
};

export type TreeEntryTreeProps = OwnProps & DispatchProps;

export function TreeEntryTree({
  treeEntry: { oid, path },
  onPress,
}: TreeEntryTreeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <FetchObject oid={oid}>
        <Text
          onPress={() => {
            setIsOpen(!isOpen);
            onPress(oid);
          }}
        >
          <FolderIcon isOpen={isOpen} />
          <Text>{path}</Text>
        </Text>
        {isOpen && <TreeObject oid={oid} />}
      </FetchObject>
    </View>
  );
}

function FolderIcon({ isOpen }: { isOpen: boolean }) {
  return isOpen ? <FolderOpened /> : <FolderClosed />;
}

function FolderOpened() {
  return (
    <FontAwesomeIcon icon={faFolderOpen} style={{ paddingRight: '.25rem' }} />
  );
}

function FolderClosed() {
  return <FontAwesomeIcon icon={faFolder} style={{ paddingRight: '.25rem' }} />;
}

export default function(ownProps: OwnProps) {
  const dispatch = useDispatch();

  return (
    <TreeEntryTree
      {...ownProps}
      onPress={(oid: string) => dispatch(updateCurrentOid(oid))}
    />
  );
}
