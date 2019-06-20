import { BlobObject as BlobObjectType, GitObject } from '@ckusro/ckusro-core';
import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../modules';
import FetchObjects from '../../FetchObject';
import { BoldText, borderBottom, SmallAndMutedText, View } from '../../shared';
import ObjectLinkView from '../../shared/ObjectLinkView';
import styled from '../../styled';

type OwnProps = {
  oid: string;
  path: string;
};

type StateProps = {
  blobObject: BlobObjectType;
};

export type BlobObjectProps = OwnProps & StateProps;

export function BlobObject({ oid, path, blobObject }: BlobObjectProps) {
  if (blobObject == null) {
    return null;
  }
  const content = new TextDecoder().decode(blobObject.content);
  const headline = content.slice(0, 200).replace(/(\r\n|\r|\n)/g, ' ');

  return (
    <ObjectLinkView oid={oid}>
      <Wrapper>
        <FileName>{path}</FileName>
        <ContentPreview>{headline}</ContentPreview>
      </Wrapper>
    </ObjectLinkView>
  );
}

const FileName = styled(BoldText)`
  margin-bottom: 0.25rem;
`;

const ContentPreview = styled(SmallAndMutedText)`
  height: 3.9em;
  overflow: hidden;
`;

const Wrapper = styled(View)`
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
  ${borderBottom}
`;

const Memoized = React.memo(BlobObject, (prev, next) => prev.oid === next.oid);

export default function(ownProps: OwnProps) {
  const gitObject: GitObject | null = useSelector(
    (state: State) => state.domain.objectManager[ownProps.oid],
  );

  if (gitObject == null) {
    return <FetchObjects oids={[ownProps.oid]} />;
  }

  return <Memoized {...ownProps} blobObject={gitObject as BlobObjectType} />;
}
