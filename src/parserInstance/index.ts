import React from 'react';
import rehypeReact from 'rehype-react';
import remarkBreaks from 'remark-breaks';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import unified from 'unified';
import transformWikiLink, {
  Options,
} from '../plugins/ckusro-plugin-component-WikiLink';
import wikiLink from '../plugins/ckusro-plugin-parser-WikiLink';
import WikiLink from '../staticRenderer/assets/components/wiki/WikiLink';

export default function parserInstance(){
  const remarkResolveJSXOptions: Options = {
    components: {
      WikiLink,
    },
  };

  // @ts-ignore
  const parser = unified()
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

    return parser
}