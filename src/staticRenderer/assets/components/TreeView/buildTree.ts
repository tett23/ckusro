import { sep } from 'path';
import { CkusroFile } from '../../../../models/ckusroFile';

export type TreeViewItem = {
  id: string;
  children: TreeViewItem[];
};

export default function buildNamespaceTree(
  files: CkusroFile[],
): TreeViewItem[] {
  const rootItems = files.filter((item) => item.path === '/');

  return rootItems.map(({ id, namespace }) => {
    return {
      id,
      children: buildTree(
        '/',
        files.filter(
          ({ namespace: ns, path }) => ns === namespace && path !== '/',
        ),
      ),
    };
  });
}

export function buildTree(
  parentPath: string,
  files: CkusroFile[],
): TreeViewItem[] {
  const scope = files.filter(({ path }) => {
    if (!path.startsWith(parentPath)) {
      return false;
    }

    return path.slice(parentPath.length + 1) !== '';
  });
  const children = scope.filter(({ path }) => {
    return path.slice(parentPath.length + 1).split(sep).length === 1;
  });

  return children.map(({ id, path }) => ({
    id,
    children: buildTree(path, scope),
  }));
}
