import fs from 'fs';
import { basename } from 'path';
import { join as joinPath } from 'path';
import { promisify } from 'util';

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

export const StatTypeDirectory: 'directory' = 'directory';
export const StatTypeFile: 'file' = 'file';
export type StatType = typeof StatTypeDirectory | typeof StatTypeFile;

export type CkusroObject = {
  name: string;
  path: string;
  fileType: StatType;
  children: CkusroObject[];
};

export async function tree(path: string, extensions: RegExp, basePath: string): Promise<CkusroObject | null> {
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

  const children = (await Promise.all(entries.map((item) => tree(`${path}/${item}`, extensions, basePath)))).filter(
    Boolean,
  ) as CkusroObject[];

  const ret: CkusroObject = {
    name: basename(path),
    path: itemPath,
    fileType: StatTypeDirectory,
    children,
  };

  return ret;
}

export type LoaderContext = {
  name: string;
  path: string;
};

export async function load(
  targetDirectory: string,
  extensions: RegExp,
): Promise<[LoaderContext, CkusroObject] | Error> {
  const context: LoaderContext = {
    name: basename(targetDirectory),
    path: targetDirectory,
  };
  const node = await tree(targetDirectory, extensions, targetDirectory);
  if (node == null) {
    return new Error('');
  }

  return [context, node];
}

export const FileTypeDirectory: 'directory' = 'directory';
export const FileTypeMarkdown: 'markdown' = 'markdown';
export const FileTypeText: 'text' = 'text';
export const FileTypeRaw: 'raw' = 'raw';
export type FileType = typeof FileTypeDirectory | typeof FileTypeMarkdown | typeof FileTypeText | typeof FileTypeRaw;
export type CkusroId = string;

export type CkusroFile = {
  id: CkusroId;
  namespace: string;
  name: string;
  path: string;
  fileType: FileType;
  isLoaded: boolean;
  content: string | null;
  weakDependencies: CkusroId[];
  strongDependencies: CkusroId[];
  variables: any[];
};

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
    id: node.path,
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

export function build(context: LoaderContext, node: CkusroObject): CkusroFile[] {
  return [transform(context, node)].concat(node.children.flatMap((item) => build(context, item)));
}

export async function loadContent(context: LoaderContext, file: CkusroFile): Promise<CkusroFile> {
  if (file.fileType === FileTypeDirectory) {
    return Object.assign({}, file, {
      isLoaded: true,
      content: null,
    });
  }

  const content = await readFile(joinPath(context.path, file.path)).catch(() => null);
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
