import { TreeObject, BlobObject, BlobOrTreeObject } from '.';
import { objectDigest } from './digest';
import { TreeEntry, BlobTreeEntry, TreeTreeEntry } from '../TreeEntry';
import typeToMode from '../../utils/typeToMode';

export type BlobContentLike = Buffer | string;
export type TreeContentLike = {
  [k in string]: BlobContentLike | TreeContentLike;
};

export type BuildTreeFromObjectResult = {
  root: TreeObject;
  objects: Array<TreeObject | BlobObject>;
};

export default async function buildTreeFromTreeLike(
  root: TreeContentLike,
): Promise<BuildTreeFromObjectResult | Error> {
  if (Object.keys(root).length === 0) {
    return new Error();
  }

  const normalized = normalizeTree(root);
  const result = await buildRecursibily(normalized);
  if (result instanceof Error) {
    return result;
  }

  const [entries, objects] = result;
  const tree = await createTreeObject(entries);
  if (tree instanceof Error) {
    return tree;
  }
  objects.push(tree);

  return {
    root: tree,
    objects: objects,
  };
}

function normalizeTree(root: TreeContentLike): TreeContentLike {
  return Object.entries(root).reduce((acc: TreeContentLike, [key, value]) => {
    const [basename, ...rest] = key.split('/');
    const current = acc[basename] || {};
    if (isBlobContentLike(current)) {
      return acc;
    }

    let newValue: BlobContentLike | TreeContentLike;
    if (isBlobContentLike(value)) {
      if (rest.length === 0) {
        newValue = value;
      } else {
        newValue = {
          ...current,
          ...normalizeTree({ [rest.join('/')]: value }),
        };
      }
    } else {
      if (rest.length === 0) {
        newValue = {
          ...current,
          ...normalizeTree(value),
        };
      } else {
        newValue = {
          ...current,
          ...normalizeTree({ [rest.join('/')]: value }),
        };
      }
    }
    if (!isBlobContentLike(newValue) && Object.keys(newValue).length === 0) {
      return acc;
    }

    acc[basename] = newValue;

    return acc;
  }, {});
}

type BuildRecursibilyResult = [TreeEntry[], BlobOrTreeObject[]];

async function buildRecursibily(
  tree: TreeContentLike,
): Promise<BuildRecursibilyResult | Error> {
  return Object.entries(tree).reduce(
    async (acc: Promise<BuildRecursibilyResult | Error>, [key, value]) => {
      const left = await acc;
      if (left instanceof Error) {
        return left;
      }

      const result = await (isBlobContentLike(value)
        ? buildBlob(key, value)
        : buildTree(key, value));
      if (result instanceof Error) {
        return result;
      }

      const [entry, newObjects] = result;
      const [entries, objects] = left;

      return [
        [...entries, entry],
        Object.values(
          [...objects, ...newObjects].reduce(
            (a, b) => ({ ...a, [b.oid]: b }),
            {},
          ),
        ),
      ] as BuildRecursibilyResult;
    },
    Promise.resolve([[], []] as BuildRecursibilyResult) as Promise<
      BuildRecursibilyResult
    >,
  );
}

async function buildTree(
  path: string,
  content: TreeContentLike,
): Promise<[TreeTreeEntry, BlobOrTreeObject[]] | Error> {
  const result = await buildRecursibily(content);
  if (result instanceof Error) {
    return result;
  }

  const [entries, objects] = result;
  const tree = await createTreeObject(entries);
  if (tree instanceof Error) {
    return tree;
  }

  return [
    {
      type: 'tree',
      oid: tree.oid,
      mode: typeToMode('tree'),
      path,
    },
    [...objects, tree],
  ];
}

async function buildBlob(
  path: string,
  content: Buffer | string,
): Promise<[BlobTreeEntry, BlobOrTreeObject[]] | Error> {
  const blob = await createBlobObject(
    typeof content === 'string' ? Buffer.from(content) : content,
  );
  if (blob instanceof Error) {
    return blob;
  }

  return [
    {
      type: 'blob',
      oid: blob.oid,
      mode: typeToMode('blob'),
      path,
    },
    [blob],
  ];
}

async function createBlobObject(buffer: Buffer): Promise<BlobObject | Error> {
  const oid = await objectDigest({ type: 'blob', content: buffer });
  if (oid instanceof Error) {
    return oid;
  }

  return {
    type: 'blob',
    oid,
    content: buffer,
  };
}

async function createTreeObject(
  treeEntries: TreeEntry[],
): Promise<TreeObject | Error> {
  const oid = await objectDigest({ type: 'tree', content: treeEntries });
  if (oid instanceof Error) {
    return oid;
  }

  return {
    type: 'tree',
    oid,
    content: treeEntries,
  };
}

function isBlobContentLike(obj: unknown): obj is BlobContentLike {
  return typeof obj === 'string' || obj instanceof Buffer;
}
