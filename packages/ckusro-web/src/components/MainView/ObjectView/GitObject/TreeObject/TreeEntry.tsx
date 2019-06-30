import {
  GitObjectTypes,
  TreeEntry as TreeEntryType,
  createInternalPath,
} from '@ckusro/ckusro-core';
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import ObjectLink from '../../../../shared/ObjectLinkText';
import { Box } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { ReactNode } from 'react';
import {
  TreeBufferInfo,
  createBufferInfo,
} from '../../../../../models/BufferInfo';

export type TreeEntryProps = {
  treeEntry: TreeEntryType;
  treeBufferInfo: TreeBufferInfo;
};

export function TreeEntry({
  treeEntry: { type, path, oid },
  treeBufferInfo,
}: TreeEntryProps) {
  return (
    <Box>
      <span>
        <Icon type={type as GitObjectTypes} path={path} />
        <ObjectLink
          bufferInfo={createBufferInfo(
            type as 'tree' | 'blob',
            oid,
            createInternalPath(treeBufferInfo.internalPath).join(path),
          )}
        >
          {path}
        </ObjectLink>
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
