import { RepoPath, url2RepoPath } from '@ckusro/ckusro-core';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { useDispatch } from 'react-redux';
import { Repository } from '../../../models/Repository';
import { cloneRepository, pullRepository } from '../../../modules/thunkActions';
import ObjectLink from '../../shared/ObjectLinkText';
import styled from '../../styled';
import { Text, View } from '../styles';

type OwnProps = {
  repoPath: RepoPath;
  headOid: string | null;
};

type DispatchProps = {
  onClickClone: (url: string) => void;
  onClickPull: () => void;
};

export type RepositoryNameProps = OwnProps & DispatchProps;

function RepositoryName({
  repoPath,
  headOid,
  onClickClone,
  onClickPull,
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
              {repoPath.name}({(headOid || 'None').slice(0, 7)})
            </Text>
          </ObjectLink>
        </View>
      </ContextMenuTrigger>
      <ContextMenu id="some_unique_identifier">
        <MenuItem onClick={onClickClone}>Clone</MenuItem>
        <MenuItem onClick={onClickPull}>Pull</MenuItem>
      </ContextMenu>
    </View>
  );
}

export default function(ownProps: {
  repository: Repository;
  headOid: string | null;
}) {
  const dispatch = useDispatch();
  const {
    repository: { url },
    headOid,
  } = ownProps;
  const repoPath = url2RepoPath(url) as RepoPath;

  return (
    <RepositoryName
      repoPath={repoPath}
      headOid={headOid}
      onClickClone={() => dispatch(cloneRepository(url))}
      onClickPull={() => dispatch(pullRepository(repoPath))}
    />
  );
}

const IconWrapper = styled(Text)`
  padding-right: 0.25rem;
`;
