import { Content, Parent, Root } from 'mdast';
import { CkusroFile, newDoesNotExistFile } from '../models/CkusroFile';
import { LoaderContext } from '../models/loaderContext';
import { Plugins } from '../models/plugins';
import parserInstance from '../parserInstance';
import parseLinkText, { determineLinkFile } from './parseLinkText';

export function buildAst(plugins: Plugins, content: string): Root {
  const parser = parserInstance(plugins);

  try {
    return parser.parse(content) as Root;
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
