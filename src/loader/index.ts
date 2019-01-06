import fs from 'fs';
import { basename } from 'path';
import { join as joinPath } from 'path';
import { promisify } from 'util';
import { TargetDirectory } from '../models/ckusroConfig';
import {
  CkusroFile,
  CkusroId,
  FileType,
  FileTypeDirectory,
  FileTypeMarkdown,
  FileTypeRaw,
  FileTypeText,
} from '../models/ckusroFile';
import { LoaderContext } from '../models/loaderContext';
import { buildAst, determineDependency } from '../parser';
import {
  CkusroObject,
  StatType,
  StatTypeDirectory,
  StatTypeFile,
} from './ckusroObject';

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

export async function tree(
  path: string,
  extensions: RegExp,
  basePath: string,
): Promise<CkusroObject | null> {
  const res = await stat(path).catch(() => null);
  if (res == null) {
    return null;
  }

  const itemPath = joinPath('/', path.slice(basePath.length));

  if (res.isFile()) {
    if (!extensions.test(path)) {
      return null;
    }

    return {
      name: basename(path),
      path: itemPath,
      fileType: StatTypeFile,
      children: [],
    };
  }
  if (!res.isDirectory()) {
    return null;
  }

  const entries = await readdir(path).catch(() => null);
  if (entries == null) {
    return null;
  }

  const children = (await Promise.all(
    entries.map((item) => tree(`${path}/${item}`, extensions, basePath)),
  )).filter(Boolean) as CkusroObject[];

  const ret: CkusroObject = {
    name: basename(path),
    path: itemPath,
    fileType: StatTypeDirectory,
    children,
  };

  return ret;
}

export async function load(
  targetDirectories: TargetDirectory[],
  extensions: RegExp,
): Promise<Array<[LoaderContext, CkusroObject]> | Error> {
  const contexts: LoaderContext[] = targetDirectories.map((item) => ({
    name: item.name,
    path: joinPath(item.path, item.innerPath),
  }));
  const ps = contexts.map(
    async (context): Promise<[LoaderContext, CkusroObject] | Error> => {
      const node = await tree(context.path, extensions, context.path);
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

export function detectType(statType: StatType, name: string): FileType {
  if (statType === StatTypeDirectory) {
    return FileTypeDirectory;
  }

  const tmp = name.split('.');
  const ext = tmp[tmp.length - 1];

  switch (ext) {
    case 'md':
      return FileTypeMarkdown;
    case 'txt':
      return FileTypeText;
    default:
      return FileTypeRaw;
  }
}

export type DependencyTable = {
  [key: string]: {
    weakDependencies: CkusroId[];
    strongDependencies: CkusroId[];
  };
};

type RefTuple = [string, string[], string[]];

export function buildDependencyTable(files: CkusroFile[]): DependencyTable {
  const depMap = files.map(
    ({ id }): RefTuple => {
      const weak = files.flatMap(({ id: refId, weakDependencies }) => {
        if (!weakDependencies.includes(id)) {
          return [];
        }

        return [refId];
      });
      const strong = files.flatMap(({ id: refId, strongDependencies }) => {
        if (!strongDependencies.includes(id)) {
          return [];
        }

        return [refId];
      });

      return [id, weak, strong];
    },
  );

  return depMap.reduce((acc: DependencyTable, [id, weak, strong]) => {
    acc[id] = { weakDependencies: weak, strongDependencies: strong };
    return acc;
  }, {});
}

function transform(context: LoaderContext, node: CkusroObject): CkusroFile {
  return {
    id: `${context.name}:${node.path}`,
    namespace: context.name,
    name: node.name,
    path: node.path,
    fileType: detectType(node.fileType, node.name),
    isLoaded: false,
    content: null,
    weakDependencies: [],
    strongDependencies: [],
    variables: [],
  };
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
  context: LoaderContext,
  file: CkusroFile,
  files: CkusroFile[],
): CkusroFile {
  if (!file.isLoaded) {
    return file;
  }

  const rootNode = buildAst(file.content || '');
  const dependencyFiles = determineDependency(context, rootNode, files);

  return Object.assign({}, file, {
    weakDependencies: dependencyFiles.map(({ id }) => id),
    strongDependencies: dependencyFiles.map(({ id }) => id),
  });
}
