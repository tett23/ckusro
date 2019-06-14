import { GitObject, TreeObject as TreeObjectType } from '@ckusro/ckusro-core';
import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../modules';
import FetchObject from '../../FetchObject';
import ObjectLinkText from '../../shared/ObjectLinkText';
import styled from '../../styled';
import { Text, treeViewItem } from '../styles';
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
    <>
      <TreeName oid={oid} path={path} isOpen={isOpen} setIsOpen={setIsOpen} />
      <TreeEntries treeEntries={!isOpen ? [] : content} />
    </>
  );
}

type TreeNameProps = {
  oid: string;
  path: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

function TreeName({ oid, path, isOpen, setIsOpen }: TreeNameProps) {
  return (
    <Wrapper>
      <Text>
        <Text onPress={() => setIsOpen(!isOpen)}>
          <FolderIcon isOpen={isOpen} />
        </Text>
        <ObjectLinkText oid={oid}>
          <Text>{path}</Text>
        </ObjectLinkText>
      </Text>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  ${treeViewItem}
`;

function FolderIcon({ isOpen }: { isOpen: boolean }) {
  const icon = isOpen ? <FolderOpened /> : <FolderClosed />;

  return <IconWrapper>{icon}</IconWrapper>;
}

const IconWrapper = styled.Text`
  padding-right: 0.25rem;
`;

function FolderOpened() {
  return <FontAwesomeIcon icon={faFolderOpen} />;
}

function FolderClosed() {
  return <FontAwesomeIcon icon={faFolder} />;
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
