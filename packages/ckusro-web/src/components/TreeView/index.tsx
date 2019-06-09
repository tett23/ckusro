import { RepoPath, url2RepoPath } from '@ckusro/ckusro-core';
import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { createRefManager, RefManager } from '../../models/RefManager';
import { Repository } from '../../models/Repository';
import { Actions, State } from '../../modules';
import { updateCurrentOid } from '../../modules/objectView';
import { cloneRepository } from '../../modules/thunkActions';
import RepositoryComponent from './Repository';

type TreeViewStates = {
  repositories: Repository[];
  refManager: RefManager;
};

export type TreeViewProps = TreeViewStates &
  ReturnType<typeof mapDispatchToProps>;

export function TreeView({
  repositories,
  refManager,
  onClickClone,
  updateCurrentOid,
}: TreeViewProps) {
  const repos = repositories.map((item) => {
    const oid = createRefManager(refManager).headOid(url2RepoPath(
      item.url,
    ) as RepoPath);

    return (
      <RepositoryComponent
        key={item.url}
        repository={item}
        headOid={oid}
        onClickClone={onClickClone}
        updateCurrentOid={updateCurrentOid}
      />
    );
  });

  return (
    <View>
      <Text>TV</Text>
      {repos}
    </View>
  );
}

function mapStateToProps({
  domain: { repositories, refManager },
}: State): TreeViewStates {
  return {
    repositories,
    refManager,
  };
}

function mapDispatchToProps(
  dispatch: ThunkDispatch<State, undefined, Actions>,
) {
  return {
    onClickClone(url: string) {
      dispatch(cloneRepository(url));
    },
    updateCurrentOid(oid: string | null) {
      dispatch(updateCurrentOid(oid));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TreeView);
