import {
  GitObjectTypes,
  TreeEntry as TreeEntryType,
} from '@ckusro/ckusro-core';
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Text, View } from '../../../shared';
import ObjectLink from '../../../shared/ObjectLinkText';
import styled from '../../../styled';

export type TreeEntryProps = {
  treeEntry: TreeEntryType;
};

export function TreeEntry({ treeEntry: { type, path, oid } }: TreeEntryProps) {
  return (
    <View>
      <Text>
        <Icon type={type as GitObjectTypes} path={path} />
        <ObjectLink oid={oid}>{path}</ObjectLink>
      </Text>
    </View>
  );
}

type IconProps = {
  type: GitObjectTypes | null;
  path: string;
};
function Icon({ type }: IconProps) {
  let icon;
  switch (type) {
    case 'blob':
      icon = <FontAwesomeIcon icon={faFile} />;
      break;
    case 'tree':
      icon = <FontAwesomeIcon icon={faFolder} />;
      break;
    default:
      icon = <EmptyIcon />;
  }

  return <IconWrapper>{icon}</IconWrapper>;
}

const IconWrapper = styled(Text)`
  padding-right: 0.25rem;
`;

const EmptyIcon = styled(Text)`
  width: 1em;
`;
