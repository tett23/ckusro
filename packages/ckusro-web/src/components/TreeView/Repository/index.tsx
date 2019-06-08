import React from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { Text, View } from 'react-native';
import { Repository } from '../../../models/Repository';

export type RepositoryProps = {
  repository: Repository;
  onClickClone: (url: string) => void;
};

export default function Repository({
  repository,
  onClickClone,
}: RepositoryProps) {
  return (
    <>
      <ContextMenuTrigger id="some_unique_identifier">
        <View>
          <Text>{repository.name}</Text>
        </View>
      </ContextMenuTrigger>

      <ContextMenu id="some_unique_identifier">
        <MenuItem onClick={() => onClickClone(repository.url)}>Clone</MenuItem>
      </ContextMenu>
    </>
  );
}
