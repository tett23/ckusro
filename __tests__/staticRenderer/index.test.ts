import { CkusroConfig } from '../../src/config';
import {
  CkusroFile,
  FileTypeDirectory,
  FileTypeMarkdown,
} from '../../src/loader';
import render, {
  buildHTML,
  buildWriteInfo,
  filterWritable,
  parse,
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

function buildFile(overrides: Partial<CkusroFile>): CkusroFile {
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
    const actual = buildWriteInfo(file);
    const expected: WriteInfo = {
      path: file.path,
      content: buildHTML(parse(file.content as string), {}),
    };

    expect(actual).toEqual(expected);
  });

  it('throws Error when isLoaded is false', () => {
    const file = buildFile({ isLoaded: false });
    const actual = () => buildWriteInfo(file);

    expect(actual).toThrowError();
  });

  it('throws Error when content is null', () => {
    const file = buildFile({ content: null });
    const actual = () => buildWriteInfo(file);

    expect(actual).toThrowError();
  });
});
