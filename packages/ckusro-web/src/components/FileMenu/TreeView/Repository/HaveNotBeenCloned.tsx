import React from 'react';
import { Repository as RepositoryType } from '../../../../models/Repository';
import RepositoryName from './RepositoryName';

export type HaveNotBeenClonedProps = {
  repository: RepositoryType;
};

export default function HaveNotBeenCloned({
  repository,
}: HaveNotBeenClonedProps) {
  return (
    <RepositoryName repository={repository} headOid={null} onClick={() => {}} />
  );
}
