import {
  CkusroFile,
  FileTypeDirectory,
  FileTypeMarkdown,
} from '../../../../../src/loader';
import buildNamespaceTree, {
  buildTree,
  TreeViewItem,
} from '../../../../../src/staticRenderer/assets/components/TreeView/buildTree';
import { buildFile } from '../../../../__fixtures__';

function _findId(items: CkusroFile[], path: string): string {
  return (items.find((item) => item.path === path) || { id: null }).id || '';
}

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
    const findId = (path: string) => _findId(files, path);

    const actual = buildNamespaceTree(files).map(({ id }) => id);
    const expected = [files[0].id, files[1].id];

    expect(actual).toMatchObject(expected);
  });
});

describe(buildTree, () => {
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
    ];
    const findId = (path: string) => _findId(files, path);

    const actual = buildTree('ns_1', '/', files);
    const expected: TreeViewItem[] = [
      {
        id: findId('/foo'),
        children: [
          {
            id: findId('/foo/bar'),
            children: [{ id: findId('/foo/bar/baz.md'), children: [] }],
          },
        ],
      },
    ];

    expect(actual).toMatchObject(expected);
  });
});
