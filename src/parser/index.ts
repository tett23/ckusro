import mdx from '@mdx-js/mdx';
import { Root } from 'mdast';
import wikiLink from './wikiLink';

export function buildAst(content: string): Root {
  return mdx.createMdxAstCompiler({ mdPlugins: [[wikiLink, {}]] }).parse(content);
}
