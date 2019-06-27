import {
  GitObjectTypes,
  TreeEntry as TreeEntryType,
} from '@ckusro/ckusro-core';
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import ObjectLink from '../../../../shared/ObjectLinkText';
import { Box } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { ReactNode } from 'react';

export type TreeEntryProps = {
  treeEntry: TreeEntryType;
};

export function TreeEntry({ treeEntry: { type, path, oid } }: TreeEntryProps) {
  return (
    <Box>
      <span>
        <Icon type={type as GitObjectTypes} path={path} />
        <ObjectLink oid={oid}>{path}</ObjectLink>
      </span>
    </Box>
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

function Span({ children }: { children?: ReactNode }) {
  return <span>{children}</span>;
}

const IconWrapper = styled(Span)({
  paddingRight: '0.25rem',
});

const EmptyIcon = styled(Span)({
  width: '1em',
});
