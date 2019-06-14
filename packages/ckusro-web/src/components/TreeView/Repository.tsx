import { CommitObject } from '@ckusro/ckusro-core';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { View } from 'react-native';
import { Repository as RepositoryType } from '../../models/Repository';
import ObjectLink from '../shared/ObjectLinkText';
import styled from '../styled';
import { Text } from './styles';
import TreeEntries from './TreeEntries';

export type RepositoryProps = {
  repository: RepositoryType;
  commitObject: CommitObject | null;
  onClickClone: (url: string) => void;
};

export default function Repository(props: RepositoryProps) {
  const { repository, commitObject } = props;
  if (commitObject == null) {
    return <HaveNotBeenCloned {...props} />;
  }

  return <Cloned repository={repository} commitObject={commitObject} />;
}

type RepositoryNameProps = {
  repository: RepositoryType;
  headOid: string | null;
  onClickClone: (url: string) => void;
};

function RepositoryName({
  repository,
  headOid,
  onClickClone,
}: RepositoryNameProps) {
  return (
    <View>
      <ContextMenuTrigger id="some_unique_identifier">
        <View>
          <ObjectLink oid={headOid}>
            <IconWrapper>
              <FontAwesomeIcon icon={faDatabase} />
            </IconWrapper>
            <Text>
              {repository.name}({(headOid || 'None').slice(0, 7)})
            </Text>
          </ObjectLink>
        </View>
      </ContextMenuTrigger>
      <ContextMenu id="some_unique_identifier">
        <MenuItem onClick={() => onClickClone(repository.url)}>Clone</MenuItem>
      </ContextMenu>
    </View>
  );
}

const IconWrapper = styled(Text)`
  padding-right: 0.25rem;
`;

type HaveNotBeenClonedProps = {
  repository: RepositoryType;
  onClickClone: (url: string) => void;
};

function HaveNotBeenCloned({
  repository,
  onClickClone,
}: HaveNotBeenClonedProps) {
  return (
    <RepositoryName
      repository={repository}
      headOid={null}
      onClickClone={onClickClone}
    />
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
  return (
    <View>
      <RepositoryName
        repository={repository}
        headOid={oid}
        onClickClone={() => {}}
      />
      <TreeEntries oid={tree} />
    </View>
  );
}
