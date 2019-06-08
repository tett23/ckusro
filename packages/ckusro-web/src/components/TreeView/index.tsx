import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Repository } from '../../models/Repository';
import { Actions, State } from '../../modules';
import { cloneRepository } from '../../modules/thunkActions';
import RepositoryComponent from './Repository';

type TreeViewStates = {
  repositories: Repository[];
};

export type TreeViewProps = TreeViewStates &
  ReturnType<typeof mapDispatchToProps>;

export function TreeView({ repositories, onClickClone }: TreeViewProps) {
  const repos = repositories.map((item) => (
    <RepositoryComponent
      key={item.url}
      repository={item}
      onClickClone={onClickClone}
    />
  ));

  return (
    <View>
      <Text>TV</Text>
      {repos}
    </View>
  );
}

function mapStateToProps({ domain: { repositories } }: State): TreeViewStates {
  return {
    repositories,
  };
}

function mapDispatchToProps(
  dispatch: ThunkDispatch<State, undefined, Actions>,
) {
  return {
    onClickClone(url: string) {
      dispatch(cloneRepository(url));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TreeView);
