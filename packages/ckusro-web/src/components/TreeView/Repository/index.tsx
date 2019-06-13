import { CommitObject } from '@ckusro/ckusro-core';
import React from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { View } from 'react-native';
import { Repository as RepositoryType } from '../../../models/Repository';
import FetchObject from '../../FetchObject';
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
  if (commitObject == null) {
    return null;
  }

  return (
    <>
      <ContextMenuTrigger id="some_unique_identifier">
        <View>
          <ObjectLink oid={commitObject.oid}>
            {repository.name}({commitObject.oid.slice(0, 7) || 'None'})
          </ObjectLink>
        </View>
      </ContextMenuTrigger>

      <View>
        <FetchObject oid={commitObject.content.tree}>
          <TreeObject oid={commitObject.content.tree} />
        </FetchObject>
      </View>

      <ContextMenu id="some_unique_identifier">
        <MenuItem onClick={() => onClickClone(repository.url)}>Clone</MenuItem>
      </ContextMenu>
    </>
  );
}
