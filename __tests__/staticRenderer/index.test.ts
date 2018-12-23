import over from 'ramda/es/over';
import { CkusroConfig } from '../../src/config';
import {
  CkusroFile,
  FileTypeDirectory,
  FileTypeMarkdown,
} from '../../src/loader';
import render, {
  buildHTML,
  filterWritable,
  parse,
} from '../../src/staticRenderer';
import { mockFileSystem, restoreFileSystem } from '../__helpers__/fs';

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

  it('returns Object 1-tuple', () => {
    const file: CkusroFile = buildFile({});
    const actual = filterWritable(file);

    expect(actual).toEqual([
      {
        path: file.path,
        content: buildHTML(parse(file.content || ''), {}),
      },
    ]);
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
