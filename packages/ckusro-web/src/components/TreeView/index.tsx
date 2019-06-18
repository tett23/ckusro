import { CommitObject, RepoPath, url2RepoPath } from '@ckusro/ckusro-core';
import React from 'react';
import { useSelector } from 'react-redux';
import { createObjectManager, ObjectManager } from '../../models/ObjectManager';
import { createRefManager, RefManager } from '../../models/RefManager';
import { Repository } from '../../models/Repository';
import { State } from '../../modules';
import FetchObjects from '../FetchObject';
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
    const commitObject =
      oid == null
        ? null
        : createObjectManager(objectManager).fetch<CommitObject>(oid);

    return (
      <FetchObjects key={item.url} oids={oid == null ? [] : [oid]}>
        <RepositoryComponent repository={item} commitObject={commitObject} />
      </FetchObjects>
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
