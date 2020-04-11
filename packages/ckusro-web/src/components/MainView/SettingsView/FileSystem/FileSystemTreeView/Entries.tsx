import React from 'react';
import { FileSystemOpened } from '../../../../../modules/ui/mainView/settingsView/fileSystem';
import Entry, { EntryItem } from './Entry';
import { join } from 'path';
import { List } from '@material-ui/core';
import useFileSystemTreeViewStyles from './useFileSystemTreeViewStyles';

type OwnProps = {
  path: string;
  entries: EntryItem[];
  opened: FileSystemOpened;
  onClickDirectory: (path: string, value: boolean) => void;
  onClickFile: (value: string | null) => void;
};

type StateProps = {};

type DispatchProps = {};

type StyleProps = {
  classes: ReturnType<typeof useFileSystemTreeViewStyles>;
};

export type FileSystemTreeViewProps = OwnProps &
  StateProps &
  DispatchProps &
  StyleProps;

export function Entries({
  path,
  opened,
  entries,
  onClickDirectory,
  onClickFile,
  classes,
}: FileSystemTreeViewProps) {
  const items = entries.map((item) => (
    <Entry
      key={join(path, item.name)}
      path={path}
      entry={item}
      opened={opened}
      onClickDirectory={onClickDirectory}
      onClickFile={onClickFile}
    />
  ));

  return (
    <List dense={true} component="div" disablePadding className={classes.list}>
      {items}
    </List>
  );
}

export default function (props: OwnProps) {
  const classes = useFileSystemTreeViewStyles();

  return <Entries {...props} classes={classes} />;
}
