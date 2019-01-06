import {
  build,
  detectType,
  loadContent,
  loadDependencies,
  loadRootObjects,
} from '../../src/fileLoader';
import {
  CkusroObject,
  StatTypeDirectory,
  StatTypeFile,
} from '../../src/fileLoader/ckusroObject';
import { TargetDirectory } from '../../src/models/ckusroConfig';
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
import { LoaderContext } from '../../src/models/loaderContext';
import { buildFile, buildLoaderContext } from '../__fixtures__';
import { mockFileSystem, restoreFileSystem } from '../__helpers__/fs';

describe(loadRootObjects.name, () => {
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
    const loaderContext = buildLoaderContext({ path: '/foo', name: 'foo' });
    const results: any = await loadRootObjects([loaderContext], /\.(md|txt)$/);
    const [context, node] = results[0];

    const expectedContext: LoaderContext = {
      name: 'foo',
      path: '/foo',
    };
    const expectedNode: CkusroObject = {
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
    };

    expect(context).toEqual(expectedContext);
    expect(node).toEqual(expectedNode);
  });

  it('returns Error when directory does not exist', async () => {
    const targetDirectory: TargetDirectory = {
      path: '/does_not_exist',
      name: 'does_not_exist',
      innerPath: './',
    };
    const actual = await loadRootObjects([targetDirectory], /\.(md|txt)$/);

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

describe(build, () => {
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
      buildFile({
        id: actual[0].id,
        namespace: 'foo',
        name: 'foo',
        path: '/foo',
        fileType: FileTypeDirectory,
        isLoaded: false,
        content: null,
        weakDependencies: [],
        strongDependencies: [],
      }),
      buildFile({
        id: actual[1].id,
        namespace: 'foo',
        name: 'bar',
        path: '/foo/bar',
        fileType: FileTypeDirectory,
        isLoaded: false,
        content: null,
        weakDependencies: [],
        strongDependencies: [],
      }),
      buildFile({
        id: actual[2].id,
        namespace: 'foo',
        name: 'baz.md',
        path: '/foo/bar/baz.md',
        fileType: FileTypeMarkdown,
        isLoaded: false,
        content: null,
        weakDependencies: [],
        strongDependencies: [],
      }),
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
    const file: CkusroFile = buildFile({
      namespace: 'foo',
      name: 'baz.md',
      path: '/bar/baz.md',
      fileType: FileTypeMarkdown,
    });

    const actual = await loadContent(context, file);
    const expected: CkusroFile = {
      ...file,
      isLoaded: true,
      content: '# test file',
    };

    expect(actual).toEqual(expected);
  });

  it('returns null content when fileType is directory', async () => {
    const context: LoaderContext = {
      name: 'foo',
      path: '/foo',
    };
    const file: CkusroFile = buildFile({
      namespace: 'foo',
      name: 'bar',
      path: '/bar',
      fileType: FileTypeDirectory,
    });

    const actual = await loadContent(context, file);
    const expected: CkusroFile = {
      ...file,
      isLoaded: true,
      content: null,
    };

    expect(actual).toEqual(expected);
  });

  it('returns null content when file does not exist', async () => {
    const context: LoaderContext = {
      name: 'foo',
      path: '/foo',
    };
    const file: CkusroFile = buildFile({
      namespace: 'foo',
      name: 'does_not_exist.md',
      path: '/does_not_exist.md',
      fileType: FileTypeMarkdown,
      isLoaded: false,
      content: null,
    });

    const actual = await loadContent(context, file);
    const expected: CkusroFile = buildFile({
      ...file,
      isLoaded: true,
      content: null,
    });

    expect(actual).toEqual(expected);
  });
});

describe(loadDependencies, () => {
  const context: LoaderContext = {
    name: 'test',
    path: '/test',
  };
  it('assigns dependencies', () => {
    const file: CkusroFile = buildFile({
      namespace: 'test',
      name: 'foo.md',
      path: '/foo.md',
      fileType: FileTypeMarkdown,
      isLoaded: true,
      content: '[[bar.md]]',
      weakDependencies: [],
      strongDependencies: [],
      variables: [],
    });
    const dep = buildFile({
      namespace: 'test',
      name: 'bar.md',
      path: '/bar.md',
      fileType: FileTypeMarkdown,
      isLoaded: true,
      content: '',
    });
    const files: CkusroFile[] = [file, dep];
    const actual = loadDependencies(context, file, files);
    const expected: CkusroFile = buildFile({
      ...file,
      weakDependencies: [dep.id],
      strongDependencies: [dep.id],
      variables: [],
    });

    expect(actual).toEqual(expected);
  });

  it('returns same object when isLoaded is false', () => {
    const file: CkusroFile = buildFile({
      namespace: 'test',
      name: 'foo.md',
      path: '/foo.md',
      fileType: FileTypeMarkdown,
    });
    const files: CkusroFile[] = [];
    const actual = loadDependencies(context, file, files);

    expect(actual).toEqual(file);
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

      expect(actual).toEqual(expected);
    });
  });
});
