import { BlobObject as BlobObjectType } from '@ckusro/ckusro-core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../../../../modules';
import { parseMarkdown } from '../../../../../modules/thunkActions';
import { HastRoot } from '../../../../Markdown/Hast';
import { Box } from '@material-ui/core';
import { BlobBufferInfo } from '../../../../../models/BufferInfo';
import { ViewModes } from '../../../../../modules/ui/mainView/objectView';
import { ViewMode } from './ViewMode';
import { EditMode } from './EditMode';

type OwnProps = {
  gitObject: BlobObjectType;
  blobBufferInfo: BlobBufferInfo;
};

type StateProps = {
  ast: HastRoot;
  viewMode: ViewModes;
};

export type BlobObjectProps = OwnProps & StateProps;

export function BlobObject({ ast, blobBufferInfo, viewMode }: BlobObjectProps) {
  switch (viewMode) {
    case 'View':
      return <ViewMode ast={ast} />;
    case 'Edit':
      return <EditMode blobBufferInfo={blobBufferInfo} />;
    default:
      return null;
  }
}

const Memoized = React.memo(
  BlobObject,
  (prev, next) =>
    prev.gitObject.oid === next.gitObject.oid &&
    prev.viewMode === next.viewMode,
);

export default function(props: OwnProps) {
  const { ast, viewMode } = useSelector((state: State) => {
    return {
      ast: state.ui.mainView.objectView.currentAst,
      viewMode: state.ui.mainView.objectView.viewMode,
    };
  });
  const dispatch = useDispatch();

  const {
    gitObject: { oid, content: buffer },
  } = props;
  const content = new TextDecoder().decode(buffer);

  useEffect(() => {
    dispatch(parseMarkdown(content));
  }, [oid]);

  if (ast == null) {
    return <Box />;
  }

  const stateProps: StateProps = {
    ast,
    viewMode,
  };

  return <Memoized {...props} {...stateProps} />;
}
