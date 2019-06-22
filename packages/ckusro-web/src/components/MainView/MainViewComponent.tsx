import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../modules';
import { MainViewTypes } from '../../modules/ui/mainView';
import ObjectView from './ObjectView';

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
    default:
      return null;
  }
}

export default function() {
  const state = useSelector((state: State) => ({
    mainViewType: state.ui.mainView.mainViewType,
  }));

  return <MainViewComponent {...state} />;
}
