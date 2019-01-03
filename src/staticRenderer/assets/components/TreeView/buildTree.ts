import { dirname, join, sep } from 'path';
import { CkusroFile } from '../../../../loader';

export type TreeViewItem = {
  id: string;
  children: TreeViewItem[];
};

export default function buildNamespaceTree(
  files: CkusroFile[],
): TreeViewItem[] {
  const nss = files.reduce(
    (acc, file) => {
      if (acc[file.namespace] == null) {
        acc[file.namespace] = [];
      }
      acc[file.namespace].push(file);

      return acc;
    },
    {} as { [key in string]: CkusroFile[] },
  );

  const ret = Object.entries(nss).reduce(
    (acc, [, items]) => {
      const root = items.find((item) => item.path === '/');
      if (root == null) {
        throw new Error('');
      }

      acc.push({
        id: root.id,
        children: buildTree('/', items),
      });

      return acc;
    },
    [] as TreeViewItem[],
  );

  return ret;
}

export function buildTree(
  parentPath: string,
  files: CkusroFile[],
): TreeViewItem[] {
  const parent = files.find((item) => item.path === parentPath);
  if (parent == null) {
    throw new Error('');
  }
  const children = files.flatMap((item) => {
    if (!item.path.startsWith(parentPath)) {
      return [];
    }

    const base = item.path.slice(parentPath.length + 1);
    if (base === '') {
      return [];
    }

    return base.split(sep).length === 1 ? [item] : [];
  });

  return children.map(({ id, path }) => ({
    id,
    children: buildTree(path, files),
  }));

  // const ret: TreeViewItemTmp[] = [];

  // files
  //   .map(({ path, id }) => [path, id])
  //   .sort(([a], [b]) => a.localeCompare(b))
  //   .forEach(([path, id]) => {
  //     visit(ret, dirname(path), (a) => {
  //       if (a.path !== dirname(path)) {
  //         return;
  //       }

  //       a.children.push({
  //         id,
  //         path,
  //         children: [],
  //       });
  //     }, () => {});
  //   });

  // return ret;
}

// function visit(
//   items: TreeViewItemTmp[],
//   search: string,
//   f: (item: TreeViewItemTmp) => void,
//   f: (item: TreeViewItemTmp) => void,
// ): void {
//   items.forEach((item) => {
//     console.log('visit', item);
//     f(item);

//     visit(item.children, f);
//   });
// }
