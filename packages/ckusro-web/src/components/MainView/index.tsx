import { Paper } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../modules';
import { MainViewTypes } from '../../modules/ui/mainView';
import ObjectView from '../ObjectView';

type OwnProps = {};

type StateProps = {
  mainViewType: MainViewTypes;
};

type DispatchProps = {};

type StyleProps = {};

export type MainViewProps = OwnProps & StateProps & DispatchProps & StyleProps;

export function MainView({ mainViewType }: MainViewProps) {
  return (
    <Paper style={{ width: 'auto', overflowY: 'scroll' }}>
      <MainViewComponent mainViewType={mainViewType} />
    </Paper>
  );
}

export default function() {
  const state = useSelector((state: State) => ({
    mainViewType: state.ui.mainView.mainViewType,
  }));

  return <MainView {...state} />;
}

type MainViewComponentProps = {
  mainViewType: MainViewTypes;
};

function MainViewComponent({ mainViewType }: MainViewComponentProps) {
  switch (mainViewType) {
    case 'object':
      return <ObjectView />;
    default:
      return null;
  }
}
