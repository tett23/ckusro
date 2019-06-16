import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../modules';
import { parseMarkdown } from '../../modules/thunkActions';
import { View } from '../shared';
import { Hast } from './Hast';
import { render } from './HtmlComponents';

export type MarkdownProps = {
  ast: Hast;
};

export function Markdown({ ast }: MarkdownProps) {
  if (ast == null) {
    return null;
  }

  const md = render(ast);

  return <View>{md}</View>;
}

export default function({ oid, text }: { oid: string; text: string }) {
  const { ast } = useSelector(({ objectView: { currentAst } }: State) => {
    return {
      ast: currentAst,
    };
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(parseMarkdown(text));
  }, [oid, text]);

  if (ast == null) {
    return <View />;
  }

  return <Markdown ast={ast} />;
}
