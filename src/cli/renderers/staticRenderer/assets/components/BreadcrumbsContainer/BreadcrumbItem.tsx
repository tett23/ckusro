import React from 'react';
import styled from 'styled-components';
import { FileBuffer } from '../../../../../../models/FileBuffer';

export type BreadcrumbItemProps = {
  fileBuffer: FileBuffer;
};

export default function BreadcrumbItem({ fileBuffer }: BreadcrumbItemProps) {
  return <Li fileBuffer={fileBuffer} />;
}

const Li = styled.li`
  :after {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    ${({ fileBuffer }: BreadcrumbItemProps) =>
      isRootFileBuffer(fileBuffer) ? "content: ':';" : ''}
    ${({ fileBuffer }: BreadcrumbItemProps) =>
      !isRootFileBuffer(fileBuffer) ? "content: '/';" : ''}
  }

  &:last-child {
    :after {
      content: '';
    }
  }
`;

type RootFileBuffer = FileBuffer;

function isRootFileBuffer(item: FileBuffer): item is RootFileBuffer {
  return item.path === '/';
}
