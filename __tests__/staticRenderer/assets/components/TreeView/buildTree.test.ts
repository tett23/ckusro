import {
  CkusroFile,
  FileTypeDirectory,
  FileTypeMarkdown,
} from '../../../../../src/models/CkusroFile';
import buildNamespaceTree, {
  buildTree,
  TreeViewItem,
} from '../../../../../src/staticRenderer/assets/components/TreeView/buildTree';
import { buildFile } from '../../../../__fixtures__';

describe(buildNamespaceTree, () => {
  it('returns root items', () => {
    const files = [
      buildFile({
        namespace: 'ns_1',
        fileType: FileTypeDirectory,
        path: '/',
      }),
      buildFile({
        namespace: 'ns_2',
        fileType: FileTypeDirectory,
        path: '/',
      }),
    ];

    const actual = buildNamespaceTree(files).map(({ id }) => id);
    const expected = [files[0].id, files[1].id];

    expect(actual).toMatchObject(expected);
  });
});

describe(buildTree, () => {
  function _findId(
    items: CkusroFile[],
    namespace: string,
    path: string,
  ): string {
    return (
      (
        items.find(
          (item) => item.namespace === namespace && item.path === path,
        ) || { id: null }
      ).id || ''
    );
  }

  it('returns children items', () => {
    const files = [
      buildFile({
        namespace: 'ns_1',
        fileType: FileTypeDirectory,
        path: '/',
      }),
      buildFile({
        namespace: 'ns_1',
        fileType: FileTypeDirectory,
        path: '/foo',
      }),
      buildFile({
        namespace: 'ns_1',
        fileType: FileTypeDirectory,
        path: '/foo/bar',
      }),
      buildFile({
        namespace: 'ns_1',
        fileType: FileTypeMarkdown,
        path: '/foo/bar/baz.md',
      }),
      buildFile({
        namespace: 'ns_2',
        fileType: FileTypeDirectory,
        path: '/',
      }),
      buildFile({
        namespace: 'ns_2',
        fileType: FileTypeMarkdown,
        path: '/hoge.md',
      }),
    ];
    const findId = (fullPath: string) => {
      const [namespace, path] = fullPath.split(':');

      return _findId(files, namespace, path);
    };

    const actual = buildTree('/', files);
    const expected: TreeViewItem[] = [
      {
        id: findId('ns_1:/foo'),
        children: [
          {
            id: findId('ns_1:/foo/bar'),
            children: [{ id: findId('ns_1:/foo/bar/baz.md'), children: [] }],
          },
        ],
      },
      {
        id: findId('ns_2:/hoge.md'),
        children: [],
      },
    ];

    expect(actual).toMatchObject(expected);
  });
});
