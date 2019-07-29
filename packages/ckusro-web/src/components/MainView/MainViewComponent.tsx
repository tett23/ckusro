import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../modules';
import { MainViewTypes } from '../../modules/ui/mainView/mainViewMisc';
import ObjectView from './ObjectView';
import SettingsView from './SettingsView';
import RepositoryView from './RepositoryView';
import DiffView from './DiffView';

type OwnProps = {};

type StateProps = {
  mainViewType: MainViewTypes;
};

type DispatchProps = {};

type StyleProps = {};

export type MainViewComponentProps = OwnProps &
  StateProps &
  DispatchProps &
  StyleProps;

export function MainViewComponent({ mainViewType }: MainViewComponentProps) {
  switch (mainViewType) {
    case 'object':
      return <ObjectView />;
    case 'repository':
      return <RepositoryView />;
    case 'diff':
      return <DiffView />;
    case 'config':
      return <SettingsView />;
    default:
      return null;
  }
}

export default function() {
  const state = useSelector((state: State) => ({
    mainViewType: state.ui.mainView.misc.mainViewType,
  }));

  return <MainViewComponent {...state} />;
}
