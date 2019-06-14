import { CommitObject } from '@ckusro/ckusro-core';
import React from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { View } from 'react-native';
import { Repository as RepositoryType } from '../../../models/Repository';
import ObjectLink from '../../ObjectView/ObjectLink';
import TreeObject from '../GitObject/TreeObject';

export type RepositoryProps = {
  repository: RepositoryType;
  commitObject: CommitObject | null;
  onClickClone: (url: string) => void;
};

export default function Repository({
  repository,
  commitObject,
  onClickClone,
}: RepositoryProps) {
  const treeOid = commitObject == null ? null : commitObject.content.tree;
  return (
    <>
      <RepositoryName
        repository={repository}
        commitObject={commitObject}
        onClickClone={onClickClone}
      />
      {treeOid && <TreeObject oid={treeOid} />}
    </>
  );
}

type RepositoryNameProps = {
  repository: RepositoryType;
  commitObject: CommitObject | null;
  onClickClone: (url: string) => void;
};

function RepositoryName({
  repository,
  commitObject,
  onClickClone,
}: RepositoryNameProps) {
  const oid = commitObject == null ? null : commitObject.oid;

  return (
    <>
      <ContextMenuTrigger id="some_unique_identifier">
        <View>
          <ObjectLink oid={oid}>
            {repository.name}({(oid || 'None').slice(0, 7)})
          </ObjectLink>
        </View>
      </ContextMenuTrigger>
      <ContextMenu id="some_unique_identifier">
        <MenuItem onClick={() => onClickClone(repository.url)}>Clone</MenuItem>
      </ContextMenu>
    </>
  );
}
