import { Content, Parent, Root } from 'mdast';
import { FileBuffer, newDoesNotExistFile } from '../models/FileBuffer';
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
    .filter((v): v is string => typeof v === 'string');
}

export function determineDependency(
  namespace: string,
  rootNode: Root,
  files: FileBuffer[],
): FileBuffer[] {
  return visit(rootNode)
    .map((item) => parseLinkText(namespace, item))
    .map((item) => determineLinkFile(item, files))
    .map(
      ({ namespace: ln, path: lp }) =>
        files.find(({ namespace: fn, path: fp }) => ln === fn && lp === fp) ||
        newDoesNotExistFile(ln, lp),
    )
    .flatMap((f) => (f ? [f] : []));
}
