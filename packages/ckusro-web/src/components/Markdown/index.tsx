import React from 'react';
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

  const md = render(ast, {});

  return <View>{md}</View>;
}

export default React.memo(Markdown, (prev, next) => prev.ast === next.ast);
