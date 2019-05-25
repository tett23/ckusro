import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { State } from '../../modules';
import { Repository } from '../../modules/domain';
import RepositoryComponent from './Repository';

type TreeViewStates = {
  repositories: Repository[];
};

export type TreeViewProps = TreeViewStates;

export function TreeView({ repositories }: TreeViewProps) {
  const repos = repositories.map((item) => (
    <RepositoryComponent key={item.url} repository={item} />
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

export default connect(mapStateToProps)(TreeView);
