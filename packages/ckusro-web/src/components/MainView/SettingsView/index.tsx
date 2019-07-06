import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../../modules';
import { Tabs, Tab, Box } from '@material-ui/core';
import {
  SettingsViewTypes,
  updateSettingsViewType,
} from '../../../modules/ui/mainView/settingsView/settingsViewMisc';
import ConfigView from './ConfigView';
import FileSystem from './FileSystem';

type OwnProps = {};

type StateProps = {
  settingsViewType: SettingsViewTypes;
};

type DispatchProps = {
  updateSettingsViewType: (value: SettingsViewTypes) => void;
};

type StyleProps = {};

export type SettingsViewProps = OwnProps &
  StateProps &
  DispatchProps &
  StyleProps;

export function SettingsView({
  settingsViewType,
  updateSettingsViewType,
}: SettingsViewProps) {
  const tabTypes: SettingsViewTypes[] = ['Config', 'FileSystem'];
  const tabs = tabTypes.map((value) => (
    <Tab key={value} value={value} label={value} />
  ));

  return (
    <>
      <Tabs
        value={settingsViewType}
        indicatorColor="primary"
        textColor="primary"
        onChange={(_, value) => updateSettingsViewType(value)}
      >
        {tabs}
      </Tabs>
      <Box>
        <Content settingsViewType={settingsViewType}></Content>
      </Box>
    </>
  );
}

export default function() {
  const state = useSelector((state: State) => ({
    settingsViewType: state.ui.mainView.settingsView.misc.settingsViewTypes,
  }));
  const dispatch = useDispatch();
  const dispatchProps = {
    updateSettingsViewType: (value: SettingsViewTypes) =>
      dispatch(updateSettingsViewType(value)),
  };

  return <SettingsView {...state} {...dispatchProps} />;
}

export type ContentProps = {
  settingsViewType: SettingsViewTypes;
};
export function Content({ settingsViewType }: ContentProps) {
  switch (settingsViewType) {
    case 'Config':
      return <ConfigView />;
    case 'FileSystem':
      return <FileSystem />;
    default:
      return null;
  }
}