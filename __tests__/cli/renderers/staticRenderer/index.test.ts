jest.mock('../../../../src/cli/renderers/staticRenderer/buildHTML');

import { WriteInfo } from '../../../../src/cli/models/WriteInfo';
import staticRenderer, {
  buildProps,
  determineAbsolutePath,
  getRenderedBuffer,
} from '../../../../src/cli/renderers/staticRenderer';
import { Props } from '../../../../src/cli/renderers/staticRenderer/assets/components';
import * as buildHTML from '../../../../src/cli/renderers/staticRenderer/buildHTML';
import { FileBuffer, FileTypeRaw } from '../../../../src/models/FileBuffer';
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
buildHTML.default.mockImplementation((props: Props) => {
  return props.markdown.currentFileId;
});

describe.skip(staticRenderer, () => {
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
    const actual = await staticRenderer(globalState, fileBuffersState);
    const expected: WriteInfo[] = [
      {
        path: '/out/ns/foo.html',
        content: '',
      },
    ];

    expect(actual).toEqual(expected);
  });
});

describe(getRenderedBuffer, () => {
  it('', () => {
    const fileBuffer = buildFileBuffer({});
    const globalState = buildGlobalState();
    const fileBuffersState = buildFileBufferState({
      fileBuffers: [fileBuffer],
    });
    const actual = getRenderedBuffer(fileBuffer, globalState, fileBuffersState);
    const expected: Partial<FileBuffer> = {
      path: '/foo.html',
      fileType: FileTypeRaw,
      content: fileBuffer.id,
    };

    expect(actual).toMatchObject(expected);
  });
});

describe(determineAbsolutePath, () => {
  it('returns absolute path', () => {
    const namespace = buildNamespace({
      outputContext: buildOutputContext({ path: '/test/namespace' }),
    });
    const fileBuffer = buildFileBuffer({ path: '/foo.html' });
    const actual = determineAbsolutePath(namespace, fileBuffer);

    expect(actual).toBe('/test/namespace/foo.html');
  });

  it('threw error when outputDir is not absolute path', () => {
    const namespace = buildNamespace({
      outputContext: buildOutputContext({ path: 'test/namespace' }),
    });
    const fileBuffer = buildFileBuffer({ path: '/foo.html' });
    const actual = () => determineAbsolutePath(namespace, fileBuffer);

    expect(actual).toThrowError(
      'Namespace.outputContext.path must start with `/`',
    );
  });

  it('threw error when filePath is not absolute path', () => {
    const namespace = buildNamespace({
      outputContext: buildOutputContext({ path: '/test/namespace' }),
    });
    const fileBuffer = buildFileBuffer({ path: 'foo.html' });
    const actual = () => determineAbsolutePath(namespace, fileBuffer);

    expect(actual).toThrowError('FileBuffer.path must start with `/`');
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
