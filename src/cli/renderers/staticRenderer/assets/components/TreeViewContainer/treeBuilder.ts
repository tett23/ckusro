import { sep } from 'path';
import { FileBuffer, FileBufferId } from '../../../../../../models/FileBuffer';

export type Root = {
  type: 'root';
  id: FileBufferId;
  children: Array<Node | Leaf>;
};

export type Node = {
  type: 'node';
  id: FileBufferId;
  children: Array<Node | Leaf>;
};

export type Leaf = {
  type: 'leaf';
  id: FileBufferId;
};

export type TreeElement = Root | Node | Leaf;

type EachNamespace = { [key in string]: FileBuffer[] };

export default function treeBuilder(fileBuffers: FileBuffer[]): Root[] {
  const eachNamespace = split(fileBuffers);

  return Object.values(eachNamespace).flatMap(
    (fbs): Root[] => {
      const root = fbs.find((item) => item.path === '/');
      if (root == null) {
        return [];
      }

      return [
        {
          type: 'root',
          id: root.id,
          children: getRootChildren(fbs).map((item) => buildTree(item, fbs)),
        },
      ];
    },
  );
}

function buildTree(
  fileBuffer: FileBuffer,
  fileBuffers: FileBuffer[],
): Node | Leaf {
  const children = getChildren(fileBuffer, fileBuffers);
  if (children.length === 0) {
    return {
      type: 'leaf',
      id: fileBuffer.id,
    };
  }

  return {
    type: 'node',
    id: fileBuffer.id,
    children: getChildren(fileBuffer, fileBuffers).map((item) => {
      return buildTree(item, fileBuffers);
    }),
  };
}

function split(fileBuffers: FileBuffer[]): EachNamespace {
  return fileBuffers.reduce(
    (acc, item) => {
      if (acc[item.namespace] == null) {
        acc[item.namespace] = [];
      }
      acc[item.namespace].push(item);

      return acc;
    },
    {} as EachNamespace,
  );
}

function getRootChildren(fileBuffers: FileBuffer[]): FileBuffer[] {
  return fileBuffers.filter(({ path }) => path !== '/' && depth(path) === 1);
}

function getChildren(
  { namespace, path }: FileBuffer,
  fileBuffers: FileBuffer[],
): FileBuffer[] {
  const parentDepth = depth(path);

  return fileBuffers
    .filter((item) => namespace === item.namespace)
    .filter((item) => {
      return item.path.startsWith(path) && depth(item.path) === parentDepth + 1;
    });
}

function depth(path: string): number {
  return path.slice(1).split(sep).length;
}
