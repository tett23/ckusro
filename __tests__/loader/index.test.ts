import {
  build,
  buildDependencyTable,
  CkusroObject,
  detectType,
  load,
  loadContent,
  loadDependencies,
  LoaderContext,
  StatTypeDirectory,
  StatTypeFile,
} from '../../src/loader';
import {
  CkusroFile,
  FileType,
  FileTypeDirectory,
  FileTypeDoesNotExist,
  FileTypeMarkdown,
  FileTypeRaw,
  FileTypeText,
  isWritableFileType,
} from '../../src/models/ckusroFile';
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
        namespace: 'foo',
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
        namespace: 'foo',
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
        namespace: 'foo',
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
    const context: LoaderContext = { name: 'foo', path: '/foo' };
    const actual = build(context, tree);
    const expected: CkusroFile[] = [
      {
        id: '/foo',
        namespace: 'foo',
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
        namespace: 'foo',
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
        namespace: 'foo',
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
      namespace: 'foo',
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
      namespace: 'foo',
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
      namespace: 'foo',
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
      namespace: 'foo',
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
      namespace: 'foo',
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
      namespace: 'foo',
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

describe(loadDependencies, () => {
  const context: LoaderContext = {
    name: 'test',
    path: '/test',
  };
  it('assigns dependencies', () => {
    const file: CkusroFile = {
      id: 'test:/foo.md',
      namespace: 'test',
      name: 'foo.md',
      path: '/foo.md',
      fileType: FileTypeMarkdown,
      isLoaded: true,
      content: '[[bar.md]]',
      weakDependencies: [],
      strongDependencies: [],
      variables: [],
    };
    const files: CkusroFile[] = [
      {
        id: 'test:/bar.md',
        namespace: 'test',
        name: 'bar.md',
        path: '/bar.md',
        fileType: FileTypeMarkdown,
        isLoaded: true,
        content: '',
        weakDependencies: [],
        strongDependencies: [],
        variables: [],
      },
    ];
    const actual = loadDependencies(context, file, files);
    const expected: CkusroFile = {
      id: 'test:/foo.md',
      namespace: 'test',
      name: 'foo.md',
      path: '/foo.md',
      fileType: FileTypeMarkdown,
      isLoaded: true,
      content: '[[bar.md]]',
      weakDependencies: ['test:/bar.md'],
      strongDependencies: ['test:/bar.md'],
      variables: [],
    };

    expect(actual).toEqual(expected);
  });

  it('returns same object when isLoaded is false', () => {
    const file: CkusroFile = {
      id: 'test:/foo.md',
      namespace: 'test',
      name: 'foo.md',
      path: '/foo.md',
      fileType: FileTypeMarkdown,
      isLoaded: false,
      content: null,
      weakDependencies: [],
      strongDependencies: [],
      variables: [],
    };
    const files: CkusroFile[] = [];
    const actual = loadDependencies(context, file, files);

    expect(actual).toBe(file);
  });
});

describe(isWritableFileType, () => {
  it('', () => {
    const data: Array<[FileType, boolean]> = [
      [FileTypeDirectory, false],
      [FileTypeDoesNotExist, false],
      [FileTypeMarkdown, true],
      [FileTypeText, true],
      [FileTypeRaw, true],
    ];

    data.forEach((item) => {
      const [value, expected] = item;
      const actual = isWritableFileType(value);

      expect(actual).toBe(expected);
    });
  });
});
