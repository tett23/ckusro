import { Content, Parent, Root } from 'mdast';
import { FileBuffer, newDoesNotExistFile } from '../models/FileBuffer';
import { compareInternalPath } from '../models/InternalPath';
import { Plugins } from '../models/plugins';
import { RepoPath } from '../models/RepoPath';
import parseLinkText, { determineLinkFile } from './parseLinkText';
import parserInstance from './parserInstance';

export default async function buildAst<
  PP extends Record<string, unknown>,
  CP extends Record<string, unknown>
>(plugins: Plugins<PP, CP>, content: string): Promise<Root | Error> {
  const parser = parserInstance(plugins);

  const result = await parser
    .run(parser.parse(content))
    .catch((err: Error) => err);
  if (result instanceof Error) {
    return result;
  }

  return result as Root;
}

function targetData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { props: { internalLink?: any } } | null,
): string | null {
  if (data == null) {
    return null;
  }

  return ((data.props || {}).internalLink || {}).target || null;
}

function visit(node: Parent | Content): string[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return [targetData((node.data as any) || null)]
    .concat(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
