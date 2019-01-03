import { sep } from 'path';
import { CkusroFile } from '../../../../loader';

export type TreeViewItem = {
  id: string;
  children: TreeViewItem[];
};

export default function buildNamespaceTree(
  files: CkusroFile[],
): TreeViewItem[] {
  const rootItems = files.flatMap((item) => (item.path === '/' ? [item] : []));

  return rootItems.map(({ id, namespace }) => {
    return {
      id,
      children: buildTree(namespace, '/', files),
    };
  });
}

export function buildTree(
  namespace: string,
  parentPath: string,
  files: CkusroFile[],
): TreeViewItem[] {
  return files
    .flatMap((item) => {
      if (item.namespace !== namespace) {
        return [];
      }
      if (!item.path.startsWith(parentPath)) {
        return [];
      }

      const base = item.path.slice(parentPath.length + 1);
      if (base === '') {
        return [];
      }

      return base.split(sep).length === 1 ? [item] : [];
    })
    .map(({ id, path }) => ({
      id,
      children: buildTree(namespace, path, files),
    }));
}
