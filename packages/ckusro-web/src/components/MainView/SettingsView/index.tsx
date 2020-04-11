import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../../modules';
import { Tabs, Tab } from '@material-ui/core';
import {
  SettingsViewTypes,
  updateSettingsViewType,
} from '../../../modules/ui/mainView/settingsView/settingsViewMisc';
import ConfigView from './ConfigView';
import FileSystem from './FileSystem';
import RawPersistedConfig from './RawPersistedConfig';
import RawUIConfig from './RawUIConfig';
import RawUIDomain from './RawUIDomain';
import useSettingsViewStyles from './useSettingsViewStyles';

type OwnProps = {};

type StateProps = {
  settingsViewType: SettingsViewTypes;
};

type DispatchProps = {
  updateSettingsViewType: (value: SettingsViewTypes) => void;
};

type StyleProps = {
  classes: ReturnType<typeof useSettingsViewStyles>;
};

export type SettingsViewProps = OwnProps &
  StateProps &
  DispatchProps &
  StyleProps;

export function SettingsView({
  settingsViewType,
  updateSettingsViewType,
  classes,
}: SettingsViewProps) {
  const tabTypes: SettingsViewTypes[] = [
    'Config',
    'FileSystem',
    'RawPersistedState',
    'RawUIConfig',
    'RawUIDomain',
  ];
  const tabs = tabTypes.map((value) => (
    <Tab key={value} value={value} label={value} />
  ));

  return (
    <div className={classes.wrapper}>
      <div className={classes.tabs}>
        <Tabs
          variant="scrollable"
          value={settingsViewType}
          indicatorColor="primary"
          textColor="primary"
          onChange={(_, value) => updateSettingsViewType(value)}
        >
          {tabs}
        </Tabs>
      </div>
      <div>
        <Content settingsViewType={settingsViewType} />
      </div>
    </div>
  );
}

export default function () {
  const state = useSelector((state: State) => ({
    settingsViewType: state.ui.mainView.settingsView.misc.settingsViewTypes,
  }));
  const dispatch = useDispatch();
  const dispatchProps = {
    updateSettingsViewType: (value: SettingsViewTypes) =>
      dispatch(updateSettingsViewType(value)),
  };
  const styleProps: StyleProps = {
    classes: useSettingsViewStyles(),
  };

  return <SettingsView {...state} {...dispatchProps} {...styleProps} />;
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
    case 'RawPersistedState':
      return <RawPersistedConfig />;
    case 'RawUIConfig':
      return <RawUIConfig />;
    case 'RawUIDomain':
      return <RawUIDomain />;
    default:
      return null;
  }
}
