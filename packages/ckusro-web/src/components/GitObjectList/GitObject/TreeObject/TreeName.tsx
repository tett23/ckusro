import React from 'react';
import { borderBottom, SmallAndMutedText, View } from '../../../shared';
import ObjectLinkView from '../../../shared/ObjectLinkView';
import styled from '../../../styled';

export type TreeNameProps = {
  oid: string;
  name: string;
};

export default function TreeName({ oid, name }: TreeNameProps) {
  return (
    <TreeNameWrapper>
      <ObjectLinkView oid={oid}>
        <CenterizedText>{name}</CenterizedText>
      </ObjectLinkView>
    </TreeNameWrapper>
  );
}

const CenterizedText = styled(SmallAndMutedText)`
  text-align: center;
`;

const TreeNameWrapper = styled(View)`
  ${borderBottom};
  justify-content: center;
  align-items: center;
  padding: 0.1rem;
`;
