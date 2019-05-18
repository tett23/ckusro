import React from 'react';
import styled from 'styled-components';
import { FileBuffer } from '../../../../../../models/FileBuffer';
import BreadcrumbItem from './BreadcrumbItem';
import getAncestors from './getAncesters';

export type Props = {
  fileBuffers: FileBuffer[];
  fileBuffer: FileBuffer;
};

export default function Breadcrumbs({ fileBuffers, fileBuffer }: Props) {
  const items = [fileBuffer]
    .concat(getAncestors(fileBuffer, fileBuffers))
    .map((item) => {
      return <BreadcrumbItem key={item.id} fileBuffer={item} />;
    });

  return (
    <nav>
      <Ul>{items}</Ul>
    </nav>
  );
}

const Ul = styled.ul`
  display: flex;
  flex-direction: row;
  list-style: none;
  padding: 0;
  margin: 0;
`;
