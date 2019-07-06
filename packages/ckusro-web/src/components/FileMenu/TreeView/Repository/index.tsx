import { CommitObject, RepositoryInfo } from '@ckusro/ckusro-core';
import React from 'react';
import Cloned from './Cloned';
import HaveNotBeenCloned from './HaveNotBeenCloned';

export type RepositoryProps = {
  repository: RepositoryInfo;
  commitObject: CommitObject | null;
};

export default function Repository(props: RepositoryProps) {
  const { repository, commitObject } = props;
  if (commitObject == null) {
    return <HaveNotBeenCloned {...props} />;
  }

  return <Cloned repository={repository} commitObject={commitObject} />;
}
