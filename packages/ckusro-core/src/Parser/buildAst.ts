import { Content, Parent, Root } from 'mdast';
import { FileBuffer, newDoesNotExistFile } from '../models/FileBuffer';
import { compareInternalPath } from '../models/InternalPath';
import { Plugins } from '../models/plugins';
import { RepoPath } from '../models/RepoPath';
import parseLinkText, { determineLinkFile } from './parseLinkText';
import parserInstance from './parserInstance';

export default function buildAst(plugins: Plugins, content: string): Root {
  const parser = parserInstance(plugins);

  try {
    return parser.runSync(parser.parse(content)) as Root;
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
  repoPath: RepoPath,
  rootNode: Root,
  files: FileBuffer[],
): FileBuffer[] {
  return visit(rootNode)
    .map((item) => parseLinkText(repoPath, item))
    .map((item) => determineLinkFile(item, files))
    .map(
      ({ internalPath: a }) =>
        files.find(({ internalPath: b }) => compareInternalPath(a, b)) ||
        newDoesNotExistFile(a),
    )
    .flatMap((f) => (f ? [f] : []));
}
