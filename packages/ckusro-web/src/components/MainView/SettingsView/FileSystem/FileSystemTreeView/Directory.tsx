import React, { useEffect, useState } from 'react';
import FS from 'fs';
import LightningFs from '@isomorphic-git/lightning-fs';
import { FileSystemOpened } from '../../../../../modules/ui/mainView/settingsView/fileSystem';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@material-ui/core';
import { join, basename } from 'path';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Entries from './Entries';
import { useSelector } from 'react-redux';
import { State } from '../../../../../modules';
import { EntryTypes } from './Entry';

type OwnProps = {
  path: string;
  opened: FileSystemOpened;
  onClickDirectory: (path: string, value: boolean) => void;
  onClickFile: (value: string | null) => void;
};

type EntryType = 'Directory' | 'File';

type Entry = {
  type: EntryType;
  name: string;
};

type StateProps = {
  entries: Entry[];
};

type DispatchProps = {};

type StyleProps = {};

export type FileSystemTreeViewProps = OwnProps &
  StateProps &
  DispatchProps &
  StyleProps;

export function Directory({
  path,
  opened,
  entries,
  onClickDirectory,
  onClickFile,
}: FileSystemTreeViewProps) {
  const isOpen = !!opened[path];

  return (
    <>
      <ListItem button onClick={() => onClickDirectory(join(path), !isOpen)}>
        <ListItemIcon>
          <FontAwesomeIcon icon={faFolderOpen} />
        </ListItemIcon>
        <ListItemText primary={basename(path)} />
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Entries
          path={path}
          opened={opened}
          entries={entries}
          onClickDirectory={onClickDirectory}
          onClickFile={onClickFile}
        />
      </Collapse>
    </>
  );
}

export default function(props: OwnProps) {
  const [entries, setEntries] = useState([] as Entry[]);
  const state = useSelector((state: State) => ({
    coreId: state.config.coreId,
  }));
  useEffect(() => {
    (async () => {
      const fs = await getFsInstance(state.coreId);
      if (fs instanceof Error) {
        return;
      }
      const items = await fs.promises.readdir(props.path);
      const ps = items.map(async (item) => {
        return [item, await fs.promises.stat(join(props.path, item))] as const;
      });
      const udpateItems = (await Promise.all(ps)).map(([name, stat]) => {
        return {
          name,
          type: (stat.isFile() ? 'File' : 'Directory') as EntryTypes,
        };
      });
      setEntries(udpateItems);
    })();
  }, [props.path]);

  return <Directory {...props} entries={entries} />;
}

async function getFsInstance(coreId: string): Promise<typeof FS | Error> {
  return (async () => new LightningFs(coreId))().catch((err: Error) => err);
}
