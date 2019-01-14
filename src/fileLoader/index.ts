import fs from 'fs';
import { join as joinPath } from 'path';
import { promisify } from 'util';
import { LoaderConfig } from '../models/ckusroConfig';
import {
  CkusroFile,
  FileTypeDirectory,
  newCkusroFile,
} from '../models/ckusroFile';
import { LoaderContext } from '../models/loaderContext';
import { Plugins } from '../models/plugins';
import { buildAst, determineDependency } from '../parser';
import { buildObjectTree } from './buildObjectTree';
import { CkusroObject, detectType } from './ckusroObject';

const readFile = promisify(fs.readFile);

export async function loadRootObjects(
  contexts: LoaderContext[],
  loaderConfig: LoaderConfig,
): Promise<Array<[LoaderContext, CkusroObject]> | Error> {
  const ps = contexts.map(
    async (context): Promise<[LoaderContext, CkusroObject] | Error> => {
      const node = await buildObjectTree(
        context.path,
        loaderConfig,
        context.path,
      );
      if (node == null) {
        return new Error('');
      }

      return [context, node];
    },
  );
  const items = await Promise.all(ps);

  const err = items.flatMap((item) => (item instanceof Error ? [item] : []));
  if (err.length >= 1) {
    return err[0];
  }

  const ret = items.flatMap((item) => (item instanceof Error ? [] : [item]));

  return ret;
}

function transform(context: LoaderContext, node: CkusroObject): CkusroFile {
  return newCkusroFile({
    namespace: context.name,
    name: node.name,
    path: node.path,
    fileType: detectType(node.fileType, node.name),
    isLoaded: false,
    content: null,
    weakDependencies: [],
    strongDependencies: [],
    variables: [],
  });
}

export function build(
  context: LoaderContext,
  node: CkusroObject,
): CkusroFile[] {
  return [transform(context, node)].concat(
    node.children.flatMap((item) => build(context, item)),
  );
}

export async function loadContent(
  context: LoaderContext,
  file: CkusroFile,
): Promise<CkusroFile> {
  if (file.fileType === FileTypeDirectory) {
    return Object.assign({}, file, {
      isLoaded: true,
      content: null,
    });
  }

  const content = await readFile(joinPath(context.path, file.path)).catch(
    () => null,
  );
  if (content == null) {
    return Object.assign({}, file, {
      isLoaded: true,
      content: null,
    });
  }

  const merge: Partial<CkusroFile> = {
    isLoaded: true,
    content: content.toString(),
  };
  return Object.assign({}, file, merge);
}

export function loadDependencies(
  plugins: Plugins,
  context: LoaderContext,
  file: CkusroFile,
  files: CkusroFile[],
): CkusroFile {
  if (!file.isLoaded) {
    return file;
  }

  const rootNode = buildAst(plugins, file.content || '');
  const dependencyFiles = determineDependency(context, rootNode, files);

  return Object.assign({}, file, {
    weakDependencies: dependencyFiles.map(({ id }) => id),
    strongDependencies: dependencyFiles.map(({ id }) => id),
  });
}
