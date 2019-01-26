import * as _fileLoader from '../../src/fileLoader';
import {
  buildFiles,
  loadContent,
  loadDependencies,
} from '../../src/fileLoader';
import {
  CkusroFile,
  FileTypeDirectory,
  FileTypeMarkdown,
} from '../../src/models/CkusroFile';
import { newCkusroFile } from '../../src/models/CkusroFile';
import {
  buildFile,
  buildLoaderConfig,
  buildLocalLoaderContext,
  buildPlugins,
} from '../__fixtures__';
import {
  mockFileSystem,
  restoreFileSystem,
} from '../__helpers__/mockFileSystem';

import * as _fetchEntries from '../../src/fileLoader/fetchEntries';
import { defaultLoaderConfig } from '../../src/models/ckusroConfig/LoaderConfig';
import * as _ckusroFile from '../../src/models/CkusroFile';
import { LocalLoaderContext } from '../../src/models/loaderContext/LocalLoaderContext';

const { default: fetchEntries } = _fetchEntries;

describe.skip(_fileLoader.default, () => {
  let buildFilesSpy: jest.SpyInstance;
  let loadContentSpy: jest.SpyInstance;
  let loadDependenciesSpy: jest.SpyInstance;

  beforeEach(() => {
    buildFilesSpy = jest.spyOn(_fileLoader, 'buildFiles');
    loadContentSpy = jest.spyOn(_fileLoader, 'loadContent');
    loadDependenciesSpy = jest.spyOn(_fileLoader, 'loadDependencies');
  });

  afterEach(() => {
    buildFilesSpy.mockRestore();
    loadContentSpy.mockRestore();
    loadDependenciesSpy.mockRestore();
  });

  function spyBuildFiles(mock: typeof buildFiles) {
    buildFilesSpy.mockImplementationOnce(mock);
  }

  function spyLoadContent(mock: typeof loadContent) {
    loadContentSpy.mockImplementationOnce(mock);
  }

  function spyLoadDependencies(mock: typeof loadDependencies) {
    loadDependenciesSpy.mockImplementationOnce(mock);
  }

  it('returns CkusroFile', async () => {
    const context = buildLocalLoaderContext({
      path: '/test/ns',
      name: 'ns',
    });

    const file: CkusroFile = buildFile({
      namespace: 'ns',
      name: 'foo.md',
      path: '/foo.md',
      fileType: FileTypeMarkdown,
    });

    const dep = buildFile({
      namespace: 'ns',
      name: 'bar.md',
      path: '/bar.md',
      fileType: FileTypeMarkdown,
    });

    const contentLoaded: CkusroFile = {
      ...file,
      isLoaded: true,
      content: '[[bar.md]]',
    };
    const depContentLoaded: CkusroFile = {
      ...dep,
      isLoaded: true,
      content: '',
    };

    const dependenciesLoaded: CkusroFile = {
      ...contentLoaded,
      weakDependencies: [dep.id],
      strongDependencies: [dep.id],
      variables: [],
    };

    spyBuildFiles(async () => {
      return [file, dep];
    });
    spyLoadContent(async () => contentLoaded);
    spyLoadContent(async () => depContentLoaded);
    spyLoadDependencies(() => dependenciesLoaded);
    spyLoadDependencies(() => depContentLoaded);

    const config = buildLoaderConfig();
    const plugins = buildPlugins();
    const actual = await _fileLoader.default([context], config, plugins);
    const expected = [dependenciesLoaded, depContentLoaded];

    expect(actual).toEqual(expected);
    expect(buildFilesSpy).toHaveReturnedTimes(1);
    expect(buildFilesSpy).toHaveBeenLastCalledWith([context], config);
    expect(loadContentSpy).toHaveReturnedTimes(2);
    expect(loadContentSpy).toHaveBeenNthCalledWith(1, [context, file]);
    expect(loadContentSpy).toHaveBeenNthCalledWith(2, [context, dep]);
    expect(loadDependencies).toHaveReturnedTimes(2);
    expect(loadDependencies).toHaveBeenNthCalledWith(1, [
      context,
      dependenciesLoaded,
    ]);
    expect(loadDependencies).toHaveBeenNthCalledWith(2, [
      contentLoaded,
      depContentLoaded,
    ]);
  });
});

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
    const context = buildLocalLoaderContext({
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

    const context = buildLocalLoaderContext({
      path: '/test/ns',
      name: 'ns',
    });
    const config = buildLoaderConfig();
    const actual = await buildFiles([context], config);
    const expected = [err];

    expect(actual).toMatchObject(expected);
  });

  it('returns Error[] when fetchEntries returns Error', async () => {
    const context = buildLocalLoaderContext({
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
    const context: LocalLoaderContext = buildLocalLoaderContext({
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
    const context: LocalLoaderContext = buildLocalLoaderContext({
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
    const context: LocalLoaderContext = {
      type: 'LocalLoaderContext',
      name: 'foo',
      path: '/foo',
      loaderConfig: defaultLoaderConfig(),
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
  const context: LocalLoaderContext = buildLocalLoaderContext({
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
