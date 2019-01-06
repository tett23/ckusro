import { Content, Parent, Root } from 'mdast';
import remarkBreaks from 'remark-breaks';
import remarkParse from 'remark-parse';
import unified from 'unified';
import { LoaderContext } from '../loader';
import { CkusroFile, newDoesNotExistFile } from '../models/ckusroFile';
import wikiLink from '../plugins/ckusro-plugin-parser-WikiLink';
import parseLinkText, { determineLinkFile } from './parseLinkText';

export function buildAst(content: string): Root {
  try {
    // @ts-ignore
    return unified()
      .use(remarkParse, { gfm: true })
      .use(remarkBreaks)
      .use(wikiLink)
      .parse(content);
  } catch (e) {
    throw e;
  }
}

function targetData(
  data: { props: { internalLink?: any } } | null,
): string | null {
  if (data == null) {
    return null;
  }

  return ((data.props || {}).internalLink || {}).target || null;
}

function visit(node: Parent | Content): string[] {
  return [targetData((node.data as any) || null)]
    .concat(
      ((node.children as any) || []).flatMap((n: any): string[] => visit(n)),
    )
    .flatMap((v: string | null) => (v == null ? [] : [v]));
}

export function determineDependency(
  context: LoaderContext,
  rootNode: Root,
  files: CkusroFile[],
): CkusroFile[] {
  return visit(rootNode)
    .map((item) => parseLinkText(context, item))
    .map((item) => determineLinkFile(item, files))
    .map(
      ({ namespace: ln, path: lp }) =>
        files.find(({ namespace: fn, path: fp }) => ln === fn && lp === fp) ||
        newDoesNotExistFile(ln, lp),
    )
    .flatMap((f) => (f ? [f] : []));
}
