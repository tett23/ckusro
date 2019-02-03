jest.mock('fs');
jest.mock('mkdirp');
jest.mock('../../../src/cli/staticRenderer/render');
jest.mock('../../../src/cli/staticRenderer/assets');

import fs from 'fs';
import * as mkdirp from 'mkdirp';
import staticRenderer, {
  buildProps,
  buildWriteInfo,
  determineAbsolutePath,
  FileInfo,
  filterNamespace,
  filterWritable,
  renderEachNamesace,
} from '../../../src/cli/staticRenderer';
import * as assets from '../../../src/cli/staticRenderer/assets';
import * as render from '../../../src/cli/staticRenderer/render';
import { defaultLoaderConfig } from '../../../src/models/ckusroConfig/LoaderConfig';
import {
  FileTypeDirectory,
  FileTypeMarkdown,
} from '../../../src/models/FileBuffer';
import {
  buildDependency,
  buildFileBuffer,
  buildFileBufferState,
  buildGlobalState,
  buildLocalLoaderContext,
  buildNamespace,
  buildOutputContext,
} from '../../__fixtures__';
import {
  mockFileSystem,
  restoreFileSystem,
} from '../../__helpers__/mockFileSystem';

// @ts-ignore
render.default.mockResolvedValue({
  html: '',
  css: '',
});

// @ts-ignore
mkdirp.default.mockImplementation((...args) => {
  args[args.length - 1](null, true);
});

// @ts-ignore
fs.writeFile.mockImplementation((...args) => {
  args[args.length - 1](null, true);
});

// @ts-ignore
assets.jsAssets.mockResolvedValue(true);

describe(staticRenderer, () => {
  // beforeEach(() => {
  //   mockFileSystem({
  //     '/test/foo/bar/baz.md': '# test file',
  //   });
  // });
  // afterEach(() => {
  //   restoreFileSystem();
  // });

  it('returns true array', async () => {
    const globalState = buildGlobalState({
      namespaces: [
        buildNamespace({
          loaderContext: buildLocalLoaderContext({
            type: 'LocalLoaderContext',
            path: '/test/ns',
            name: 'ns',
            loaderConfig: defaultLoaderConfig(),
          }),
          outputContext: buildOutputContext({
            path: '/out',
            name: 'ns',
          }),
        }),
      ],
    });
    const fileBuffersState = buildFileBufferState({
      fileBuffers: [
        buildFileBuffer({
          namespace: 'ns',
          path: '/foo.md',
          fileType: FileTypeMarkdown,
          content: 'test file',
        }),
      ],
    });
    const [actualResults, actualErrors] = await staticRenderer(
      globalState,
      fileBuffersState,
    );

    expect(actualResults).toEqual(true);
    expect(actualErrors).toEqual(undefined);
  });
});

describe(renderEachNamesace, () => {
  beforeEach(() => {
    mockFileSystem({
      '/test/ns/foo/bar/baz.md': '# test file',
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

  it('returns boolean array', async () => {
    const outputContext = buildOutputContext({ name: 'ns', path: '/out' });
    const loaderContext = buildLocalLoaderContext({
      name: 'ns',
      path: '/test/ns',
    });
    const files = [buildFileBuffer({ namespace: outputContext.name })];
    const globalState = buildGlobalState({
      namespaces: [
        buildNamespace({
          loaderContext,
          outputContext,
        }),
      ],
    });
    const fileBuffersState = buildFileBufferState({ fileBuffers: files });
    const actual = await renderEachNamesace(
      globalState,
      fileBuffersState,
      outputContext,
    );

    expect(actual).toEqual([true]);
  });
});

describe(filterNamespace, () => {
  it('returns 1-tuple when match namespace', () => {
    const file = buildFileBuffer({ namespace: 'ns1' });
    const actual = filterNamespace('ns1', file);

    expect(actual).toEqual([file]);
  });

  it('returns 0-tuple when does not match namespace', () => {
    const file = buildFileBuffer({ namespace: 'ns2' });
    const actual = filterNamespace('ns1', file);

    expect(actual).toEqual([]);
  });
});

describe(filterWritable, () => {
  it('returns Object 1-tuple', () => {
    const file = buildFileBuffer({});
    const actual = filterWritable(file);

    expect(actual).toEqual([file]);
  });

  it('returns 0-tuple when fileType is not writable type', () => {
    const file = buildFileBuffer({ fileType: FileTypeDirectory });
    const actual = filterWritable(file);

    expect(actual).toEqual([]);
  });

  it('returns 0-tuple when content is null', () => {
    const file = buildFileBuffer({ content: null });
    const actual = filterWritable(file);

    expect(actual).toEqual([]);
  });
});

describe(buildWriteInfo, () => {
  it('returns WriteInfo', () => {
    const file = buildFileBuffer({});
    const context = buildOutputContext({ path: '/out/ns', name: 'ns' });
    const actual = buildWriteInfo(context, file);
    const expected: FileInfo = {
      path: '/out/ns/foo.html',
      file,
    };

    expect(actual).toEqual(expected);
  });

  it('throws Error when content is null', () => {
    const file = buildFileBuffer({ content: null });
    const context = buildOutputContext({ path: '/out', name: 'ns' });
    const actual = () => buildWriteInfo(context, file);

    expect(actual).toThrowError();
  });
});

describe(determineAbsolutePath, () => {
  it('returns absolute path', () => {
    const actual = determineAbsolutePath('/test/namespace', '/foo.md');

    expect(actual).toBe('/test/namespace/foo.md');
  });

  it('threw error when outputDir is not absolute path', () => {
    const actual = () => determineAbsolutePath('test/namespace', '/foo.md');

    expect(actual).toThrowError('outputDir must start with `/`');
  });

  it('threw error when filePath is not absolute path', () => {
    const actual = () => determineAbsolutePath('/test/namespace', 'foo.md');

    expect(actual).toThrowError('filePath must start with `/`');
  });
});

describe(buildProps, () => {
  it('', () => {
    const unreferenced = [buildFileBuffer()];
    const referenced = [buildFileBuffer(), buildFileBuffer()];
    const file = buildFileBuffer({
      dependencies: buildDependency({
        name: [referenced[0].id],
        content: [referenced[1].id],
      }),
    });
    const files = [file].concat(unreferenced).concat(referenced);
    const globalState = buildGlobalState();
    const fileBuffersState = buildFileBufferState({ fileBuffers: files });
    const actual = buildProps(globalState, fileBuffersState, file.id);
    const expected = [file].concat(referenced).map(({ id }) => id);

    expect(actual.globalState).toEqual(globalState);
    expect(actual.markdown.currentFileId).toEqual(file.id);
    expect(actual.markdown.files.map(({ id }) => id)).toEqual(expected);
  });
});
