jest.mock('../../../../src/cli/renderers/staticRenderer/render');

import { WriteInfo } from '../../../../src/cli/models/WriteInfo';
import staticRenderer, {
  buildProps,
  determineAbsolutePath,
  filterFileBuffers,
  filterNamespace,
  filterWritable,
  renderEachNamesace,
} from '../../../../src/cli/renderers/staticRenderer';
import * as render from '../../../../src/cli/renderers/staticRenderer/render';
import { defaultLoaderConfig } from '../../../../src/models/ckusroConfig/LoaderConfig';
import {
  FileTypeDirectory,
  FileTypeMarkdown,
} from '../../../../src/models/FileBuffer';
import {
  buildDependency,
  buildFileBuffer,
  buildFileBufferState,
  buildGlobalState,
  buildLocalLoaderContext,
  buildNamespace,
  buildOutputContext,
} from '../../../__fixtures__';

// @ts-ignore
render.default.mockResolvedValue({
  html: '',
  css: '',
});

describe.skip(staticRenderer, () => {
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

describe.skip(renderEachNamesace, () => {
  it('returns WriteInfo[]', async () => {
    const outputContext = buildOutputContext({ name: 'ns', path: '/out' });
    const loaderContext = buildLocalLoaderContext({
      name: 'ns',
      path: '/test/ns',
    });
    const globalState = buildGlobalState({
      namespaces: [
        buildNamespace({
          loaderContext,
          outputContext,
        }),
      ],
    });
    const files = [
      buildFileBuffer({
        namespace: outputContext.name,
        path: '/foo.md',
        content: 'test file',
      }),
    ];
    const fileBuffersState = buildFileBufferState({
      fileBuffers: files,
    });
    const actual = await renderEachNamesace(globalState, fileBuffersState);
    const expected: WriteInfo[] = [
      {
        path: '/out/ns/foo.md',
        content: '',
      },
    ];

    expect(actual).toEqual(expected);
  });
});

describe(filterNamespace, () => {
  it('returns [FileBuffer] when match namespace', () => {
    const fileBuffers = [buildFileBuffer({ namespace: 'ns' })];
    const namespaces = [buildNamespace({ name: 'ns' })];
    const actual = filterNamespace(fileBuffers, namespaces);

    expect(actual).toEqual(fileBuffers);
  });

  it('returns [] when does not match namespace', () => {
    const fileBuffers = [buildFileBuffer({ namespace: 'does_not_exist' })];
    const namespaces = [buildNamespace({ name: 'ns' })];
    const actual = filterNamespace(fileBuffers, namespaces);

    expect(actual).toEqual([]);
  });
});

describe(filterWritable, () => {
  it('returns Object 1-tuple', () => {
    const fileBuffers = [buildFileBuffer({})];
    const actual = filterWritable(fileBuffers);

    expect(actual).toEqual(fileBuffers);
  });

  it('returns 0-tuple when fileType is not writable type', () => {
    const fileBuffers = [buildFileBuffer({ fileType: FileTypeDirectory })];
    const actual = filterWritable(fileBuffers);

    expect(actual).toEqual([]);
  });

  it('returns 0-tuple when content is null', () => {
    const fileBuffers = [buildFileBuffer({ content: null })];
    const actual = filterWritable(fileBuffers);

    expect(actual).toEqual([]);
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
