import React from 'react';
import rehypeReact from 'rehype-react';
import remarkBreaks from 'remark-breaks';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import unified from 'unified';
import { ComponentPlugin } from '../models/ComponentPlugin';
import { Plugins } from '../models/plugins';
import renderJSXComponent, { Options } from './renderJSXComponent';

export default function parserInstance(plugins: Plugins) {
  let parser = unified()
    .use(remarkParse, { gfm: true })
    .use(remarkBreaks);

  plugins.parsers.forEach(({ plugin }) => {
    parser = parser.use(plugin);
  });

  // @ts-ignore
  parser = parser.use(remarkRehype, null, jsxHandlers(plugins.components));
  parser = parser.use(rehypeReact, { createElement: React.createElement });

  return parser;
}

function jsxHandlers(plugins: ComponentPlugin[]) {
  const componentPlugins = plugins.reduce(
    (acc, { plugin }) => {
      acc[plugin.name || plugin.name] = plugin;

      return acc;
    },
    {} as any,
  );
  const remarkResolveJSXOptions: Options = {
    components: componentPlugins,
  };
  const handlers = {
    jsx: (_: any, node: any) => {
      return renderJSXComponent(remarkResolveJSXOptions, node);
    },
  };

  return {
    handlers,
  };
}
