import React from 'react';
import { FileSystemOpened } from '../../../../../modules/ui/mainView/settingsView/fileSystem';
import { join } from 'path';
import File from './File';
import Directory from './Directory';

export type EntryTypes = 'Directory' | 'File';

export type EntryItem = {
  type: EntryTypes;
  name: string;
};

type OwnProps = {
  path: string;
  entry: EntryItem;
  opened: FileSystemOpened;
  onClickDirectory: (path: string, value: boolean) => void;
  onClickFile: (value: string | null) => void;
};

type StateProps = {};

type DispatchProps = {};

type StyleProps = {};

export type FileSystemTreeViewProps = OwnProps &
  StateProps &
  DispatchProps &
  StyleProps;

export function Entry({
  path,
  entry,
  opened,
  onClickDirectory,
  onClickFile,
}: FileSystemTreeViewProps) {
  switch (entry.type) {
    case 'Directory':
      return (
        <Directory
          path={join(path, entry.name)}
          opened={opened}
          onClickDirectory={onClickDirectory}
          onClickFile={onClickFile}
        />
      );
    case 'File':
      return <File path={entry.name} onClick={onClickFile} />;
    default:
      return null;
  }
}

export default function(props: OwnProps) {
  return <Entry {...props} />;
}
