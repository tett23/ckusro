import { BlobObject as BlobObjectType } from '@ckusro/ckusro-core';
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../../modules';
import { updateCurrentOid } from '../../../modules/thunkActions';
import FetchObject from '../../FetchObject';
import { BoldText, borderBottom, SmallAndMutedText } from '../../shared';
import styled from '../../styled';

type OwnProps = {
  oid: string;
  path: string;
};

type StateProps = {
  blobObject: BlobObjectType;
};

type DispatchProps = {
  onPress: () => void;
};

export type BlobObjectProps = OwnProps & StateProps & DispatchProps;

export function BlobObject({ path, blobObject, onPress }: BlobObjectProps) {
  if (blobObject == null) {
    return null;
  }
  const content = new TextDecoder().decode(blobObject.content);
  const headline = content.slice(0, 200).replace(/(\r\n|\r|\n)/g, ' ');

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Wrapper>
        <FileName>{path}</FileName>
        <ContentPreview>{headline}</ContentPreview>
      </Wrapper>
    </TouchableWithoutFeedback>
  );
}

const FileName = styled(BoldText)`
  margin-bottom: 0.25rem;
`;

const ContentPreview = styled(SmallAndMutedText)`
  height: 3.9em;
  overflow: hidden;
`;

const Wrapper = styled.View`
  padding: 0.75rem;
  ${borderBottom}
`;

export default function(ownProps: OwnProps) {
  const objectManager = useSelector(
    (state: State) => state.domain.objectManager,
  );
  const gitObject = objectManager[ownProps.oid] as BlobObjectType;
  const dispatch = useDispatch();
  const onPress = () => dispatch(updateCurrentOid(ownProps.oid));

  if (gitObject == null) {
    return <FetchObject oid={ownProps.oid} />;
  }

  return (
    <FetchObject oid={ownProps.oid}>
      <BlobObject {...ownProps} blobObject={gitObject} onPress={onPress} />
    </FetchObject>
  );
}
