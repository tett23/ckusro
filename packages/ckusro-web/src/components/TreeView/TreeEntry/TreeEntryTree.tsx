import { TreeEntry } from '@ckusro/ckusro-core';
import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import FetchObject from '../../FetchObject';
import ObjectLink from '../../ObjectView/ObjectLink';
import TreeObject from '../GitObject/TreeObject';

export type TreeEntryTreeProps = {
  treeEntry: TreeEntry;
};

export default function TreeEntryTree({
  treeEntry: { oid, path },
}: TreeEntryTreeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <FetchObject oid={oid}>
        <Text onPress={() => setIsOpen(!isOpen)}>
          <FolderIcon isOpen={isOpen} />
          <ObjectLink oid={oid}>{path}</ObjectLink>
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
  return <FontAwesomeIcon icon={faFolderOpen} />;
}

function FolderClosed() {
  return <FontAwesomeIcon icon={faFolder} />;
}
