import React from 'react';
import RepositoryName from './RepositoryName';
import { RepositoryInfo } from '@ckusro/ckusro-core';

export type HaveNotBeenClonedProps = {
  repository: RepositoryInfo;
};

export default function HaveNotBeenCloned({
  repository,
}: HaveNotBeenClonedProps) {
  return (
    <RepositoryName repository={repository} headOid={null} onClick={() => {}} />
  );
}
