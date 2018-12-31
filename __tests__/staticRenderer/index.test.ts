import { CkusroConfig } from '../../src/config';
import {
  CkusroFile,
  FileTypeDirectory,
  FileTypeMarkdown,
  FileTypeText,
  LoaderContext,
} from '../../src/loader';
import render, {
  buildHTML,
  buildWriteInfo,
  determineAbsolutePath,
  filterWritable,
  parse,
  replacePath,
  WriteInfo,
} from '../../src/staticRenderer';
import { mockFileSystem, restoreFileSystem } from '../__helpers__/fs';

const template = {
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

function buildFile(overrides: Partial<CkusroFile> = {}): CkusroFile {
  return Object.assign({}, template, overrides);
}

describe(render, () => {
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
    const actual = await render(conf);

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
    const actual = buildWriteInfo('/test', 'ns', file);
    const expected: WriteInfo = {
      path: '/test/ns/foo.html',
      content: buildHTML(parse(file.content as string), {}),
    };

    expect(actual).toEqual(expected);
  });

  it('throws Error when isLoaded is false', () => {
    const file = buildFile({ isLoaded: false });
    const actual = () => buildWriteInfo('/test', 'foo', file);

    expect(actual).toThrowError();
  });

  it('throws Error when content is null', () => {
    const file = buildFile({ content: null });
    const actual = () => buildWriteInfo('/test', 'foo', file);

    expect(actual).toThrowError();
  });
});

describe(replacePath, () => {
  it('replaces path', () => {
    const file = buildFile({ path: '/test.md', fileType: FileTypeMarkdown });
    const actual = replacePath(file);

    expect(actual).toBe('/test.html');
  });

  it('throws Error when fileType is not markdown or txt', () => {
    const data: Array<[CkusroFile, boolean]> = [
      [buildFile({ fileType: FileTypeMarkdown }), false],
      [buildFile({ fileType: FileTypeText }), false],
      [buildFile({ fileType: FileTypeDirectory }), true],
    ];
    data.forEach(([file, isThrowError]) => {
      const actual = () => replacePath(file);

      if (isThrowError) {
        expect(actual).toThrowError();
      } else {
        expect(actual).not.toThrowError();
      }
    });
  });
});

describe(determineAbsolutePath, () => {
  it('returns absolute path', () => {
    const actual = determineAbsolutePath('/test', 'namespace', '/foo.md');

    expect(actual).toBe('/test/namespace/foo.md');
  });

  it('threw error when outputDir is not absolute path', () => {
    const actual = () => determineAbsolutePath('test', 'namespace', '/foo.md');

    expect(actual).toThrowError('outputDir must start with `/`');
  });

  it('threw error when filePath is not absolute path', () => {
    const actual = () => determineAbsolutePath('/test', 'namespace', 'foo.md');

    expect(actual).toThrowError('filePath must start with `/`');
  });
});
