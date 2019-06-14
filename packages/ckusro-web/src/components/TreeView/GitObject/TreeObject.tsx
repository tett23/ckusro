import { GitObject, TreeObject as TreeObjectType } from '@ckusro/ckusro-core';
import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../modules';
import FetchObject from '../../FetchObject';
import { Text } from '../../shared';
import ObjectLinkText from '../../shared/ObjectLinkText';
import styled from '../../styled';
import { TreeEntries } from '../TreeEntries';

export type TreeObjectProps = {
  path: string;
  treeObject: TreeObjectType;
};

export function TreeObject({
  path,
  treeObject: { oid, content },
}: TreeObjectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Wrapper>
      <Text>
        <Text onPress={() => setIsOpen(!isOpen)}>
          <FolderIcon isOpen={isOpen} />
        </Text>
        <ObjectLinkText oid={oid}>{path}</ObjectLinkText>
      </Text>
      <TreeEntries treeEntries={!isOpen ? [] : content} />
    </Wrapper>
  );
}

const Wrapper = styled.View`
  margin-left: 1rem;
`;

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

export default function({ path, oid }: { path: string; oid: string }) {
  const gitObject: GitObject | null = useSelector(
    (state: State) => state.domain.objectManager[oid],
  );
  if (gitObject == null) {
    return <FetchObject oid={oid} />;
  }

  return <TreeObject path={path} treeObject={gitObject as TreeObjectType} />;
}
