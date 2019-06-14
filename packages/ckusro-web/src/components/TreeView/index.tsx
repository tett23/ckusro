import { CommitObject, RepoPath, url2RepoPath } from '@ckusro/ckusro-core';
import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { ObjectManager } from '../../models/ObjectManager';
import { createRefManager, RefManager } from '../../models/RefManager';
import { Repository } from '../../models/Repository';
import { Actions, State } from '../../modules';
import { cloneRepository } from '../../modules/thunkActions';
import FetchObject from '../FetchObject';
import { drawer } from '../shared';
import styled from '../styled';
import RepositoryComponent from './Repository';

type TreeViewStates = {
  repositories: Repository[];
  objectManager: ObjectManager;
  refManager: RefManager;
};

export type TreeViewProps = TreeViewStates &
  ReturnType<typeof mapDispatchToProps>;

export function TreeView({
  repositories,
  objectManager,
  refManager,
  onClickClone,
}: TreeViewProps) {
  const repos = repositories.map((item) => {
    const oid = createRefManager(refManager).headOid(url2RepoPath(
      item.url,
    ) as RepoPath);
    const commitObject: CommitObject | null =
      oid == null ? null : (objectManager[oid] as CommitObject);

    return (
      <FetchObject key={item.url} oid={oid}>
        <RepositoryComponent
          repository={item}
          commitObject={commitObject}
          onClickClone={onClickClone}
        />
      </FetchObject>
    );
  });

  return <Wrapper>{repos}</Wrapper>;
}

function mapStateToProps({
  domain: { repositories, objectManager, refManager },
}: State): TreeViewStates {
  return {
    repositories,
    objectManager,
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TreeView);

const Wrapper = styled.View`
  ${drawer}
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 0.25rem 0.5rem;
  width: 15vw;
  flex-basis: 15vw;
`;
