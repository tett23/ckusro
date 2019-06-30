import { CommitObject } from '@ckusro/ckusro-core';
import React from 'react';
import { Repository as RepositoryType } from '../../../../models/Repository';
import Cloned from './Cloned';
import HaveNotBeenCloned from './HaveNotBeenCloned';

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
