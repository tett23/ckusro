import React from 'react';
import { FileSystemOpened } from '../../../../../modules/ui/mainView/settingsView/fileSystem';
import Directory from './Directory';

type OwnProps = {};

type StateProps = {
  opened: FileSystemOpened;
};

type DispatchProps = {
  onClickDirectory: (path: string, value: boolean) => void;
  onClickFile: (value: string | null) => void;
};

type StyleProps = {};

export type FileSystemTreeViewProps = OwnProps &
  StateProps &
  DispatchProps &
  StyleProps;

export default function FileSystemTreeView({
  opened,
  onClickDirectory,
  onClickFile,
}: FileSystemTreeViewProps) {
  return (
    <Directory
      path="/"
      opened={opened}
      onClickDirectory={onClickDirectory}
      onClickFile={onClickFile}
    />
  );
}
