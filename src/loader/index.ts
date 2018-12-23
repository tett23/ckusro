import fs from 'fs';
import { basename } from 'path';
import { promisify } from 'util';

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

export const StatTypeDirectory: 'directory' = 'directory';
export const StatTypeFile: 'file' = 'file';
export type StatType = typeof StatTypeDirectory | typeof StatTypeFile;

export type CkusroObject = {
  name: string;
  path: string;
  fileType: StatType;
  children: CkusroObject[];
};

async function tree(path: string, extensions: RegExp): Promise<CkusroObject | null> {
  const res = await stat(path).catch(() => null);
  if (res == null) {
    return null;
  }
  if (res.isFile()) {
    if (!extensions.test(path)) {
      return null;
    }

    return {
      name: basename(path),
      path,
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

  const children = (await Promise.all(entries.map((item) => tree(`${path}/${item}`, extensions)))).filter(
    Boolean,
  ) as CkusroObject[];

  const ret: CkusroObject = {
    name: basename(path),
    path,
    fileType: StatTypeDirectory,
    children,
  };

  return ret;
}

export async function load(targetDirectory: string, extensions: RegExp): Promise<CkusroObject | null> {
  return await tree(targetDirectory, extensions);
}

export const FileTypeDirectory: 'directory' = 'directory';
export const FileTypeMarkdown: 'markdown' = 'markdown';
export const FileTypeText: 'text' = 'text';
export const FileTypeRaw: 'raw' = 'raw';
export type FileType = typeof FileTypeDirectory | typeof FileTypeMarkdown | typeof FileTypeText | typeof FileTypeRaw;
export type CkusroId = string;

export type CkusroFile = {
  id: CkusroId;
  name: string;
  fileType: FileType;
  isLoaded: boolean;
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

function transform(node: CkusroObject): CkusroFile {
  return {
    id: node.path,
    name: node.name,
    fileType: detectType(node.fileType, node.name),
    isLoaded: false,
    weakDependencies: [],
    strongDependencies: [],
    variables: [],
  };
}

export function build(node: CkusroObject): CkusroFile[] {
  return [transform(node)].concat(node.children.flatMap((item) => build(item)));
}
