import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import unified from 'unified';
import { Node } from 'unist';
import { State } from '../../modules';
import { parseMarkdown } from '../../modules/thunkActions';
import { View } from '../shared';

export type MarkdownProps = {
  ast: Node;
};

export function Markdown({ ast }: MarkdownProps) {
  return <View />;
}

export default function({ text }: { text: string }) {
  const { ast } = useSelector(({ objectView: { currentAst } }: State) => {
    return {
      ast: currentAst,
    };
  });
  const dispatch = useDispatch();
  if (ast == null) {
    dispatch(parseMarkdown(text));
    return <View />;
  }

  return <Markdown ast={ast} />;
}
