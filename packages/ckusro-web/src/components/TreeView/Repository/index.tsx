import React, { useEffect } from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { Text, View } from 'react-native';
import { Repository } from '../../../models/Repository';

export type RepositoryProps = {
  repository: Repository;
  headOid: string | null;
  onClickClone: (url: string) => void;
  updateCurrentOid: (oid: string | null) => void;
};

export default function Repository({
  repository,
  headOid,
  onClickClone,
  updateCurrentOid,
}: RepositoryProps) {
  useEffect(() => {
    if (headOid == null) {
    }
  }, [headOid]);

  return (
    <>
      <ContextMenuTrigger id="some_unique_identifier">
        <View>
          <Text onPress={() => updateCurrentOid(headOid)}>
            {repository.name}({headOid || 'None'})
          </Text>
        </View>
      </ContextMenuTrigger>

      <ContextMenu id="some_unique_identifier">
        <MenuItem onClick={() => onClickClone(repository.url)}>Clone</MenuItem>
      </ContextMenu>
    </>
  );
}
