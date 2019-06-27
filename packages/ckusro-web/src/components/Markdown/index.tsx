import React from 'react';
import { Hast } from './Hast';
import { render } from './HtmlComponents';
import { Box } from '@material-ui/core';

export type MarkdownProps = {
  ast: Hast;
};

export function Markdown({ ast }: MarkdownProps) {
  if (ast == null) {
    return null;
  }

  const md = render(ast, {});

  return <Box>{md}</Box>;
}

export default React.memo(Markdown, (prev, next) => prev.ast === next.ast);
