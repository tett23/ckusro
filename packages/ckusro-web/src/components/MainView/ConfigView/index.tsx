import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../../modules';
import { Tabs, Tab, Box } from '@material-ui/core';
import {
  SettingsViewTypes,
  updateSettingsViewType,
} from '../../../modules/ui/mainView/configView/settingsViewMisc';
import SettingsView from './ConfigView';

type OwnProps = {};

type StateProps = {
  settingsViewType: SettingsViewTypes;
};

type DispatchProps = {
  updateSettingsViewType: (value: SettingsViewTypes) => void;
};

type StyleProps = {};

export type ConfigViewProps = OwnProps &
  StateProps &
  DispatchProps &
  StyleProps;

export function ConfigView({
  settingsViewType,
  updateSettingsViewType,
}: ConfigViewProps) {
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
    settingsViewType: state.ui.mainView.configView.misc.settingsViewTypes,
  }));
  const dispatch = useDispatch();
  const dispatchProps = {
    updateSettingsViewType: (value: SettingsViewTypes) =>
      dispatch(updateSettingsViewType(value)),
  };

  return <ConfigView {...state} {...dispatchProps} />;
}

export type ContentProps = {
  settingsViewType: SettingsViewTypes;
};
export function Content({ settingsViewType }: ContentProps) {
  switch (settingsViewType) {
    case 'Config':
      return <SettingsView />;
    case 'FileSystem':
      return null;
    default:
      return null;
  }
}
