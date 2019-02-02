import * as _fileLoader from '../../src/fileLoader';
import {
  buildFiles,
  loadContent,
  loadDependencies,
} from '../../src/fileLoader';
import {
  buildFileBuffer,
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
import * as _fileBuffer from '../../src/models/FileBuffer';
import {
  FileBuffer,
  FileTypeDirectory,
  FileTypeMarkdown,
  newFileBuffer,
} from '../../src/models/FileBuffer';
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

  it('returns FileBuffer', async () => {
    const context = buildLocalLoaderContext({
      path: '/test/ns',
      name: 'ns',
    });

    const file = buildFileBuffer({
      namespace: 'ns',
      path: '/foo.md',
      fileType: FileTypeMarkdown,
    });

    const dep = buildFileBuffer({
      namespace: 'ns',
      path: '/bar.md',
      fileType: FileTypeMarkdown,
    });

    const contentLoaded: FileBuffer = {
      ...file,
      content: '[[bar.md]]',
    };
    const depContentLoaded: FileBuffer = {
      ...dep,
      content: '',
    };

    const dependenciesLoaded: FileBuffer = {
      ...contentLoaded,
      dependencies: {
        name: [dep.id],
        content: [dep.id],
      },
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
  let newFileBufferSpy: jest.SpyInstance;
  beforeEach(() => {
    fetchEntriesSpy = jest.spyOn(_fetchEntries, 'default');
    newFileBufferSpy = jest.spyOn(_fileBuffer, 'newFileBuffer');
  });

  afterEach(() => {
    fetchEntriesSpy.mockRestore();
    newFileBufferSpy.mockRestore();
  });

  function spyFetchEntries(mock: typeof fetchEntries) {
    fetchEntriesSpy = jest.spyOn(_fetchEntries, 'default');

    fetchEntriesSpy.mockImplementation(mock);
  }

  function spyNewFileBuffer(mock: typeof newFileBuffer) {
    newFileBufferSpy = jest.spyOn(_fileBuffer, 'newFileBuffer');

    newFileBufferSpy.mockImplementation(mock);
  }

  it('returns FileBuffer[]', async () => {
    const context = buildLocalLoaderContext({
      path: '/test/ns',
      name: 'ns',
    });
    spyFetchEntries(async () => [[context, '/test/ns/foo.md']]);

    const file = buildFileBuffer({
      namespace: 'ns',
      path: '/foo.md',
      fileType: FileTypeMarkdown,
      content: null,
    });
    spyNewFileBuffer(async () => file);

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
    spyNewFileBuffer(async () => err);

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
    const file = buildFileBuffer({
      namespace: 'foo',
      path: '/bar/baz.md',
      fileType: FileTypeMarkdown,
    });

    const actual = await loadContent(context, file);
    const expected: FileBuffer = {
      ...file,
      content: '# test file',
    };

    expect(actual).toEqual(expected);
  });

  it('returns null content when fileType is directory', async () => {
    const context: LocalLoaderContext = buildLocalLoaderContext({
      name: 'foo',
      path: '/foo',
    });
    const file = buildFileBuffer({
      namespace: 'foo',
      path: '/bar',
      fileType: FileTypeDirectory,
    });

    const actual = await loadContent(context, file);
    const expected: FileBuffer = {
      ...file,
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
    const file = buildFileBuffer({
      namespace: 'foo',
      path: '/does_not_exist.md',
      fileType: FileTypeMarkdown,
      content: null,
    });

    const actual = await loadContent(context, file);
    const expected = buildFileBuffer({
      ...file,
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
    const file = buildFileBuffer({
      namespace: 'test',
      path: '/foo.md',
      fileType: FileTypeMarkdown,
      content: '[[bar.md]]',
      dependencies: {
        name: [],
        content: [],
      },
      variables: [],
    });
    const dep = buildFileBuffer({
      namespace: 'test',
      path: '/bar.md',
      fileType: FileTypeMarkdown,
      content: '',
    });
    const files: FileBuffer[] = [file, dep];
    const actual = loadDependencies(plugins, context, file, files);
    const expected = buildFileBuffer({
      ...file,
      dependencies: {
        name: [dep.id],
        content: [dep.id],
      },
      variables: [],
    });

    expect(actual).toEqual(expected);
  });

  it('returns same object when isLoaded is false', () => {
    const file = buildFileBuffer({
      namespace: 'test',
      path: '/foo.md',
      fileType: FileTypeMarkdown,
    });
    const files: FileBuffer[] = [];
    const actual = loadDependencies(plugins, context, file, files);

    expect(actual).toEqual(file);
  });
});
