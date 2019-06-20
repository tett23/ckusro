import { BlobObject as BlobObjectType } from '@ckusro/ckusro-core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../../modules';
import { parseMarkdown } from '../../../modules/thunkActions';
import Markdown from '../../Markdown';
import { Hast } from '../../Markdown/Hast';
import { View } from '../../shared';

export type BlobObjectProps = {
  ast: Hast;
};

export function BlobObject({ ast }: BlobObjectProps) {
  return (
    <View>
      <Markdown ast={ast} />
    </View>
  );
}

const Memoized = React.memo(BlobObject, (prev, next) => prev.ast === next.ast);

export default function(props: { gitObject: BlobObjectType }) {
  const { ast } = useSelector(({ objectView: { currentAst } }: State) => {
    return {
      ast: currentAst,
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
    return <View />;
  }

  return <Memoized ast={ast} />;
}
