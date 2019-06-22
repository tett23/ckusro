import { CommitObject } from '@ckusro/ckusro-core';
import { Collapse } from '@material-ui/core';
import React, { useState } from 'react';
import { Repository as RepositoryType } from '../../../models/Repository';
import { View } from '../../shared';
import TreeEntries from '../TreeEntries';
import RepositoryName from './RepositoryName';

export type RepositoryProps = {
  repository: RepositoryType;
  commitObject: CommitObject | null;
};

export default function Repository(props: RepositoryProps) {
  const { repository, commitObject } = props;
  if (commitObject == null) {
    return <HaveNotBeenCloned {...props} />;
  }

  return <Cloned repository={repository} commitObject={commitObject} />;
}

type HaveNotBeenClonedProps = {
  repository: RepositoryType;
};

function HaveNotBeenCloned({ repository }: HaveNotBeenClonedProps) {
  return (
    <RepositoryName repository={repository} headOid={null} onClick={() => {}} />
  );
}

type ClonedProps = {
  repository: RepositoryType;
  commitObject: CommitObject;
};

function Cloned({
  repository,
  commitObject: {
    oid,
    content: { tree },
  },
}: ClonedProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <RepositoryName
        repository={repository}
        headOid={oid}
        onClick={() => setIsOpen(!isOpen)}
      />
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <TreeEntries oid={tree} />
      </Collapse>
    </View>
  );
}
