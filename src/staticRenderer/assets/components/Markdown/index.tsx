import React from 'react';
import rehypeReact from 'rehype-react';
import remarkBreaks from 'remark-breaks';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import unified from 'unified';
import { CkusroFile } from '../../../../models/ckusroFile';
import wikiLink from '../../../../parser/wikiLink';
import WikiLink from '../wiki/WikiLink';
import transformWikiLink, { Options } from './handlers/WikiLink';

export type Props = {
  currentFileId: string;
  files: CkusroFile[];
};

export function Markdown({ currentFileId, files }: Props) {
  const file = files.find(({ id }) => id === currentFileId);
  if (file == null) {
    throw new Error(`File not found. id == ${currentFileId}`);
  }

  return buildJSX(file.content || '');
}

export function buildJSX(content: string) {
  const remarkResolveJSXOptions: Options = {
    components: {
      WikiLink,
    },
  };

  // @ts-ignore
  const jsx = unified()
    .use(remarkParse, { gfm: true })
    .use(remarkBreaks)
    .use(wikiLink)
    .use(rehypeReact, { createElement: React.createElement })
    .use(remarkRehype, null, {
      handlers: {
        jsx: (_: any, node: any) => {
          return transformWikiLink(remarkResolveJSXOptions, node);
        },
      },
    })
    .processSync(content).contents;

  return jsx;
}
