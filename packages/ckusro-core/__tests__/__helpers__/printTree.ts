import { TreeObject, BlobOrTreeObject, GitObject } from '../../src';

export default function printTree(
  tree: TreeObject,
  objects: BlobOrTreeObject[],
  indent = 0,
): string {
  const spacer = Array.from({ length: indent })
    .map(() => ' ')
    .join('');

  return tree.content
    .flatMap(({ path, oid, type }) => {
      if (type === 'blob') {
        return `${spacer}${path}(${oid.slice(0, 6)})`;
      }

      const children = objects.find((item) => oid == item.oid);
      if (children == null) {
        return `${spacer}${path}(${oid.slice(0, 6)})`;
      }

      return [
        `${spacer}${path}(${oid.slice(0, 6)})`,
        printTree(children as TreeObject, objects, indent + 2),
      ];
    })
    .join('\n');
}

export async function printTree2(
  tree: TreeObject,
  readObject: (oid: string) => Promise<GitObject | null | Error>,
  indent = 0,
): Promise<string> {
  const spacer = Array.from({ length: indent })
    .map(() => ' ')
    .join('');

  const result = await tree.content.reduce(
    async (acc: Promise<string[] | Error>, { path, oid, type }) => {
      const left = await acc;
      if (left instanceof Error) {
        return left;
      }

      if (type === 'blob') {
        return [...left, `${spacer}${path}(${oid.slice(0, 6)})`];
      }

      const children = await readObject(oid);
      if (children instanceof Error) {
        return children;
      }
      if (children == null) {
        return [...left, `${spacer}${path}(${oid.slice(0, 6)})`];
      }

      const c = await printTree2(
        children as TreeObject,
        readObject,
        indent + 2,
      );

      return [...left, `${spacer}${path}(${oid.slice(0, 6)})`, c];
    },
    Promise.resolve([]),
  );
  if (result instanceof Error) {
    throw result;
  }

  return result.join('\n');
}
