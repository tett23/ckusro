import React from 'react';
import ObjectLink from '../../../ObjectView/ObjectLink';
import { borderBottom, SmallAndMutedText, View } from '../../../shared';
import styled from '../../../styled';

export type TreeNameProps = {
  oid: string;
  name: string;
};

export default function TreeName({ oid, name }: TreeNameProps) {
  return (
    <TreeNameWrapper>
      <ObjectLink oid={oid}>
        <SmallAndMutedText>{name}</SmallAndMutedText>
      </ObjectLink>
    </TreeNameWrapper>
  );
}

const TreeNameWrapper = styled(View)`
  ${borderBottom};
  text-align: center;
  padding: 0.1rem;
`;
