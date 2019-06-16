import { CommitObject, RepoPath, url2RepoPath } from '@ckusro/ckusro-core';
import React from 'react';
import { useSelector } from 'react-redux';
import { ObjectManager } from '../../models/ObjectManager';
import { createRefManager, RefManager } from '../../models/RefManager';
import { Repository } from '../../models/Repository';
import { State } from '../../modules';
import FetchObject from '../FetchObject';
import { drawer } from '../shared';
import styled from '../styled';
import RepositoryComponent from './Repository';

type TreeViewStates = {
  repositories: Repository[];
  objectManager: ObjectManager;
  refManager: RefManager;
};

export type TreeViewProps = TreeViewStates;

export function TreeView({
  repositories,
  objectManager,
  refManager,
}: TreeViewProps) {
  const repos = repositories.map((item) => {
    const oid = createRefManager(refManager).headOid(url2RepoPath(
      item.url,
    ) as RepoPath);
    const commitObject: CommitObject | null =
      oid == null ? null : (objectManager[oid] as CommitObject);

    return (
      <FetchObject key={item.url} oid={oid}>
        <RepositoryComponent repository={item} commitObject={commitObject} />
      </FetchObject>
    );
  });

  return <Wrapper>{repos}</Wrapper>;
}

const Wrapper = styled.View`
  ${drawer}
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 0.25rem 0.5rem;
  width: 15vw;
  flex-basis: 15vw;
`;

export default function() {
  const state = useSelector(
    ({ domain: { repositories, objectManager, refManager } }: State) => {
      return { repositories, objectManager, refManager };
    },
  );

  return <TreeView {...state} />;
}
