import { CkusroConfig } from '../../src/config';
import { CkusroFile, FileTypeDirectory } from '../../src/models/ckusroFile';
import staticRenderer, {
  buildProps,
  buildWriteInfo,
  determineAbsolutePath,
  FileInfo,
  filterWritable,
} from '../../src/staticRenderer';
import {
  buildFile,
  buildGlobalState,
  buildLoaderContext,
  buildOutputContext,
} from '../__fixtures__';
import { mockFileSystem, restoreFileSystem } from '../__helpers__/fs';

describe(staticRenderer, () => {
  beforeEach(() => {
    mockFileSystem({
      '/test/foo/bar/baz.md': '# test file',
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

  it('returns boolean array', async () => {
    const conf: CkusroConfig = {
      targetDirectory: '/test',
      outputDirectory: '/out',
      loader: {
        extensions: /\.(md|txt)$/,
      },
    };
    const actual = await staticRenderer(conf);

    expect(actual).toEqual([true]);
  });
});

describe(filterWritable, () => {
  it('returns Object 1-tuple', () => {
    const file: CkusroFile = buildFile({});
    const actual = filterWritable(file);

    expect(actual).toEqual([file]);
  });

  it('returns 0-tuple when fileType is not writable type', () => {
    const file: CkusroFile = buildFile({ fileType: FileTypeDirectory });
    const actual = filterWritable(file);

    expect(actual).toEqual([]);
  });

  it('returns 0-tuple when isLoaded is false', () => {
    const file: CkusroFile = buildFile({ isLoaded: false });
    const actual = filterWritable(file);

    expect(actual).toEqual([]);
  });

  it('returns 0-tuple when isLoaded is false', () => {
    const file: CkusroFile = buildFile({ content: null });
    const actual = filterWritable(file);

    expect(actual).toEqual([]);
  });
});

describe(buildWriteInfo, () => {
  it('returns WriteInfo', () => {
    const file = buildFile({});
    const context = buildOutputContext({ path: '/out/ns', name: 'ns' });
    const actual = buildWriteInfo(context, file);
    const expected: FileInfo = {
      path: '/out/ns/foo.html',
      file,
    };

    expect(actual).toEqual(expected);
  });

  it('throws Error when isLoaded is false', () => {
    const file = buildFile({ isLoaded: false });
    const context = buildOutputContext({ path: '/out', name: 'ns' });
    const actual = () => buildWriteInfo(context, file);

    expect(actual).toThrowError();
  });

  it('throws Error when content is null', () => {
    const file = buildFile({ content: null });
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
    const unreferenced = [buildFile()];
    const referenced = [buildFile(), buildFile()];
    const file = buildFile({
      strongDependencies: [referenced[0].id],
      weakDependencies: [referenced[1].id],
    });
    const files = [file].concat(unreferenced).concat(referenced);
    const globalState = buildGlobalState({ files });
    const actual = buildProps(globalState, file);
    const expected = [file].concat(referenced).map(({ id }) => id);

    expect(actual.globalState).toEqual(globalState);
    expect(actual.markdown.currentFileId).toEqual(file.id);
    expect(actual.markdown.files.map(({ id }) => id)).toEqual(expected);
  });
});
