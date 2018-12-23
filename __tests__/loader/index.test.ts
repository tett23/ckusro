import {
  build,
  buildDependencyTable,
  CkusroFile,
  CkusroObject,
  detectType,
  FileTypeDirectory,
  FileTypeMarkdown,
  FileTypeRaw,
  FileTypeText,
  load,
  loadContent,
  LoaderContext,
  StatTypeDirectory,
  StatTypeFile,
} from '../../src/loader';
import { mockFileSystem, restoreFileSystem } from '../__helpers__/fs';

describe(load.name, () => {
  beforeEach(() => {
    mockFileSystem({
      '/foo/bar/baz.md': '# test file',
      '/foo/bar/baz.js': '# test file',
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

  it('load items', async () => {
    const [context, node]: any = await load('/foo', /\.(md|txt)$/);

    expect(context).toEqual({
      name: 'foo',
      path: '/foo',
    });

    expect(node).toEqual({
      name: 'foo',
      path: '/',
      fileType: StatTypeDirectory,
      children: [
        {
          name: 'bar',
          path: '/bar',
          fileType: StatTypeDirectory,
          children: [
            {
              name: 'baz.md',
              path: '/bar/baz.md',
              fileType: StatTypeFile,
              children: [],
            },
          ],
        },
      ],
    });
  });

  it('returns Error when directory does not exist', async () => {
    const actual = await load('/bar', /\.(md|txt)$/);

    expect(actual).toBeInstanceOf(Error);
  });
});

describe(detectType.name, () => {
  it('returns FileTypeDirectory when statType is StatTypeDirectory', () => {
    const actual = detectType(StatTypeDirectory, '');

    expect(actual).toBe(FileTypeDirectory);
  });

  it('returns FileTypeMarkdown when extension is `md`', () => {
    const actual = detectType(StatTypeFile, 'foo.md');

    expect(actual).toBe(FileTypeMarkdown);
  });

  it('returns FileTypeMarkdown when extension is `txt`', () => {
    const actual = detectType(StatTypeFile, 'foo.txt');

    expect(actual).toBe(FileTypeText);
  });

  it('returns FileTypeRaw when provide unregistered extension', () => {
    const actual = detectType(StatTypeFile, 'foo.bar');

    expect(actual).toBe(FileTypeRaw);
  });
});

describe(buildDependencyTable.name, () => {
  it('returns FileTypeDirectory when statType is StatTypeDirectory', () => {
    const actual = buildDependencyTable([
      {
        id: '1',
        name: 'foo.md',
        path: '/foo.md',
        fileType: FileTypeMarkdown,
        isLoaded: true,
        content: null,
        weakDependencies: ['2'],
        strongDependencies: ['3'],
        variables: [],
      },
      {
        id: '2',
        name: 'foo.md',
        path: '/foo.md',
        fileType: FileTypeMarkdown,
        isLoaded: true,
        content: null,
        weakDependencies: [],
        strongDependencies: [],
        variables: [],
      },
      {
        id: '3',
        name: 'foo.md',
        path: '/foo.md',
        fileType: FileTypeMarkdown,
        isLoaded: true,
        content: null,
        weakDependencies: [],
        strongDependencies: [],
        variables: [],
      },
    ]);

    expect(actual).toEqual({
      '1': {
        weakDependencies: [],
        strongDependencies: [],
      },
      '2': {
        weakDependencies: ['1'],
        strongDependencies: [],
      },
      '3': {
        weakDependencies: [],
        strongDependencies: ['1'],
      },
    });
  });
});

describe(build.name, () => {
  it('load items', async () => {
    const tree: CkusroObject = {
      name: 'foo',
      path: '/foo',
      fileType: StatTypeDirectory,
      children: [
        {
          name: 'bar',
          path: '/foo/bar',
          fileType: StatTypeDirectory,
          children: [
            {
              name: 'baz.md',
              path: '/foo/bar/baz.md',
              fileType: StatTypeFile,
              children: [],
            },
          ],
        },
      ],
    };
    const actual = build(tree);
    const expected: CkusroFile[] = [
      {
        id: '/foo',
        name: 'foo',
        path: '/foo',
        fileType: FileTypeDirectory,
        isLoaded: false,
        content: null,
        weakDependencies: [],
        strongDependencies: [],
        variables: [],
      },
      {
        id: '/foo/bar',
        name: 'bar',
        path: '/foo/bar',
        fileType: FileTypeDirectory,
        isLoaded: false,
        content: null,
        weakDependencies: [],
        strongDependencies: [],
        variables: [],
      },
      {
        id: '/foo/bar/baz.md',
        name: 'baz.md',
        path: '/foo/bar/baz.md',
        fileType: FileTypeMarkdown,
        isLoaded: false,
        content: null,
        weakDependencies: [],
        strongDependencies: [],
        variables: [],
      },
    ];

    expect(actual).toEqual(expected);
  });
});

describe(loadContent, () => {
  beforeEach(() => {
    mockFileSystem({
      '/foo/bar/baz.md': '# test file',
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

  it('returns file content', async () => {
    const context: LoaderContext = {
      name: 'foo',
      path: '/foo',
    };
    const file: CkusroFile = {
      id: '/foo/bar/baz.md',
      name: 'baz.md',
      path: '/bar/baz.md',
      fileType: FileTypeMarkdown,
      isLoaded: false,
      content: null,
      weakDependencies: [],
      strongDependencies: [],
      variables: [],
    };

    const actual = await loadContent(context, file);
    const expected: CkusroFile = {
      id: '/foo/bar/baz.md',
      name: 'baz.md',
      path: '/bar/baz.md',
      fileType: FileTypeMarkdown,
      isLoaded: true,
      content: '# test file',
      weakDependencies: [],
      strongDependencies: [],
      variables: [],
    };

    expect(actual).toEqual(expected);
  });

  it('returns null content when fileType is directory', async () => {
    const context: LoaderContext = {
      name: 'foo',
      path: '/foo',
    };
    const file: CkusroFile = {
      id: '/bar',
      name: 'bar',
      path: '/bar',
      fileType: FileTypeDirectory,
      isLoaded: false,
      content: null,
      weakDependencies: [],
      strongDependencies: [],
      variables: [],
    };

    const actual = await loadContent(context, file);
    const expected: CkusroFile = {
      id: '/bar',
      name: 'bar',
      path: '/bar',
      fileType: FileTypeDirectory,
      isLoaded: true,
      content: null,
      weakDependencies: [],
      strongDependencies: [],
      variables: [],
    };

    expect(actual).toEqual(expected);
  });

  it('returns null content when file does not exist', async () => {
    const context: LoaderContext = {
      name: 'foo',
      path: '/foo',
    };
    const file: CkusroFile = {
      id: '/does_not_exist.md',
      name: 'does_not_exist.md',
      path: '/does_not_exist.md',
      fileType: FileTypeMarkdown,
      isLoaded: false,
      content: null,
      weakDependencies: [],
      strongDependencies: [],
      variables: [],
    };

    const actual = await loadContent(context, file);
    const expected: CkusroFile = {
      id: '/does_not_exist.md',
      name: 'does_not_exist.md',
      path: '/does_not_exist.md',
      fileType: FileTypeMarkdown,
      isLoaded: true,
      content: null,
      weakDependencies: [],
      strongDependencies: [],
      variables: [],
    };

    expect(actual).toEqual(expected);
  });
});
