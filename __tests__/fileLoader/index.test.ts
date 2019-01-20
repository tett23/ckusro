import {
  buildFiles,
  loadContent,
  loadDependencies,
} from '../../src/fileLoader';
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
import { newCkusroFile } from '../../src/models/ckusroFile';
import { LoaderContext } from '../../src/models/loaderContext';
import {
  buildFile,
  buildLoaderConfig,
  buildLoaderContext,
  buildPlugins,
} from '../__fixtures__';
import { mockFileSystem, restoreFileSystem } from '../__helpers__/fs';

import * as _fetchEntries from '../../src/fileLoader/fetchEntries';
import * as _ckusroFile from '../../src/models/ckusroFile';

const { default: fetchEntries } = _fetchEntries;

describe(buildFiles, () => {
  let fetchEntriesSpy: jest.SpyInstance;
  let newCkusroFileSpy: jest.SpyInstance;
  beforeEach(() => {
    fetchEntriesSpy = jest.spyOn(_fetchEntries, 'default');
    newCkusroFileSpy = jest.spyOn(_ckusroFile, 'newCkusroFile');
  });

  afterEach(() => {
    fetchEntriesSpy.mockRestore();
    newCkusroFileSpy.mockRestore();
  });

  function spyFetchEntries(mock: typeof fetchEntries) {
    fetchEntriesSpy = jest.spyOn(_fetchEntries, 'default');

    fetchEntriesSpy.mockImplementation(mock);
  }

  function spyNewCkusroFile(mock: typeof newCkusroFile) {
    newCkusroFileSpy = jest.spyOn(_ckusroFile, 'newCkusroFile');

    newCkusroFileSpy.mockImplementation(mock);
  }

  it('returns CkusroFile[]', async () => {
    const context = buildLoaderContext({
      path: '/test/ns',
      name: 'ns',
    });
    spyFetchEntries(async () => [[context, '/test/ns/foo.md']]);

    const file = buildFile({
      namespace: 'ns',
      name: 'foo.md',
      path: '/foo.md',
      fileType: FileTypeMarkdown,
      isLoaded: false,
      content: null,
    });
    spyNewCkusroFile(async () => file);

    const config = buildLoaderConfig();
    const actual = await buildFiles([context], config);
    const expected = [file];

    expect(actual).toMatchObject(expected);
  });

  it('returns Error[] when fetchEntries returns Error', async () => {
    const err = new Error();
    spyFetchEntries(async () => [err]);

    const context = buildLoaderContext({
      path: '/test/ns',
      name: 'ns',
    });
    const config = buildLoaderConfig();
    const actual = await buildFiles([context], config);
    const expected = [err];

    expect(actual).toMatchObject(expected);
  });

  it('returns Error[] when fetchEntries returns Error', async () => {
    const context = buildLoaderContext({
      path: '/test/ns',
      name: 'ns',
    });
    spyFetchEntries(async () => [[context, '/test/ns/foo.md']]);

    const err = new Error();
    spyNewCkusroFile(async () => err);

    const config = buildLoaderConfig();
    const actual = await buildFiles([context], config);
    const expected = [err];

    expect(actual).toMatchObject(expected);
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
    const context: LoaderContext = buildLoaderContext({
      name: 'foo',
      path: '/foo',
    });
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
    const context: LoaderContext = buildLoaderContext({
      name: 'foo',
      path: '/foo',
    });
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
  const context: LoaderContext = buildLoaderContext({
    name: 'test',
    path: '/test',
  });
  const plugins = buildPlugins();

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
    const actual = loadDependencies(plugins, context, file, files);
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
    const actual = loadDependencies(plugins, context, file, files);

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
