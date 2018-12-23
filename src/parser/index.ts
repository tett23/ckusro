import mdx from '@mdx-js/mdx';
import { Content, Parent, Root } from 'mdast';
import { basename, join as joinPath } from 'path';
import { CkusroFile, FileTypeDoesNotExist, LoaderContext } from '../loader';
import parseLinkText, { determineLinkFile } from './parseLinkText';
import wikiLink from './wikiLink';

export function buildAst(content: string): Root {
  return mdx.createMdxAstCompiler({ mdPlugins: [[wikiLink, {}]] }).parse(content);
}

function targetData(data: { internalLink?: any } | null): string | null {
  return ((data || {}).internalLink || {}).target || null;
}

function visit(node: Parent | Content): string[] {
  return [targetData(node.data || null)]
    .concat(((node.children as any) || []).flatMap((n: any): string[] => visit(n)))
    .flatMap((v: string | null) => (v == null ? [] : [v]));
}

export function buildDoesNotExistFile(namespace: string, path: string): CkusroFile {
  const absolutePath = joinPath('/', path);

  return {
    id: `${namespace}:${absolutePath}`,
    namespace,
    name: basename(path),
    path: absolutePath,
    fileType: FileTypeDoesNotExist,
    isLoaded: false,
    content: null,
    weakDependencies: [],
    strongDependencies: [],
    variables: [],
  };
}

export function determineDependency(context: LoaderContext, rootNode: Root, files: CkusroFile[]): CkusroFile[] {
  return visit(rootNode)
    .map((item) => parseLinkText(context, item))
    .map((item) => determineLinkFile(item, files))
    .map(
      ({ namespace: ln, path: lp }) =>
        files.find(({ namespace: fn, path: fp }) => ln === fn && lp === fp) || buildDoesNotExistFile(ln, lp),
    )
    .flatMap((f) => (f ? [f] : []));
}
