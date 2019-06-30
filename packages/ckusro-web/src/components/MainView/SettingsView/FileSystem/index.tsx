import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../../../modules';
import {
  updateOpened,
  updatePreview,
  FileSystemOpened,
} from '../../../../modules/ui/mainView/settingsView/fileSystem';
import FileSystemTreeView from './FileSystemTreeView';
import Preview from './Preview';

type OwnProps = {};

type StateProps = {
  opened: FileSystemOpened;
  preview: string | null;
};

type DispatchProps = {
  updateOpened: (path: string, value: boolean) => void;
  updatePreview: (value: string | null) => void;
};

type StyleProps = {};

export type ConfigViewProps = OwnProps &
  StateProps &
  DispatchProps &
  StyleProps;

export function FileSystem({
  opened,
  updateOpened,
  updatePreview,
}: ConfigViewProps) {
  return (
    <>
      <FileSystemTreeView
        opened={opened}
        onClickDirectory={updateOpened}
        onClickFile={updatePreview}
      />
      <Preview />
    </>
  );
}

export default function() {
  const state = useSelector((state: State) => ({
    ...state.ui.mainView.settingsView.fileSystem,
  }));
  const dispatch = useDispatch();
  const dispatchProps = {
    updateOpened: (path: string, value: boolean) =>
      dispatch(updateOpened(path, value)),
    updatePreview: (value: string | null) => dispatch(updatePreview(value)),
  };

  return <FileSystem {...state} {...dispatchProps} />;
}
