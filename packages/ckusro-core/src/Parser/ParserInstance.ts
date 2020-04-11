import remarkBreaks from 'remark-breaks';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import unified from 'unified';
import { ComponentPlugin } from '../models/ComponentPlugin';
import { Plugins } from '../models/plugins';
import renderJSXComponent, { Options } from './renderJSXComponent';

export type ParserInstance = unified.Processor;

export default function parserInstance<
  PP extends Record<string, unknown>,
  CP extends Record<string, unknown>
>(plugins: Plugins<PP, CP>): ParserInstance {
  let parser = unified().use(remarkParse, { gfm: true }).use(remarkBreaks);

  plugins.parsers.forEach(({ plugin }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parser = parser.use(plugin as any);
  });

  parser = parser.use(remarkRehype, null, jsxHandlers(plugins.components));

  return parser;
}

function jsxHandlers<P extends Record<string, unknown>>(
  plugins: Array<ComponentPlugin<P>>,
) {
  const componentPlugins = plugins.reduce(
    (acc, { plugin }) => {
      acc[plugin.name || plugin.name] = plugin;

      return acc;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as any,
  );
  const remarkResolveJSXOptions: Options = {
    components: componentPlugins,
  };
  const handlers = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jsx: (_: any, node: any) => {
      return renderJSXComponent(remarkResolveJSXOptions, node);
    },
  };

  return {
    handlers,
  };
}
