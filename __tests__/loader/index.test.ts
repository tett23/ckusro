import {
  detectType,
  FileTypeDirectory,
  FileTypeMarkdown,
  FileTypeRaw,
  FileTypeText,
  load,
  StatTypeDirectory,
  StatTypeFile,
} from '../../src/loader';
import { mockFileSystem, restoreFileSystem } from '../__helpers__/fs';

describe(load.name, () => {
  beforeEach(() => {
    mockFileSystem({
      '/foo/bar/baz.md': '# test file',
      '/foo/bar/baz.js': '# test file',
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

  it('load items', async () => {
    const actual = await load('/foo', /\.(md|txt)$/);

    expect(actual).toMatchObject({
      name: 'foo',
      fileType: StatTypeDirectory,
      children: [
        {
          name: 'bar',
          fileType: StatTypeDirectory,
          children: [
            {
              name: 'baz.md',
              fileType: StatTypeFile,
              children: [],
            },
          ],
        },
      ],
    });
  });
});

describe(detectType.name, () => {
  it('returns FileTypeDirectory when statType is StatTypeDirectory', () => {
    const actual = detectType(StatTypeDirectory, '');

    expect(actual).toBe(FileTypeDirectory);
  });

  it('returns FileTypeMarkdown when extension is `md`', () => {
    const actual = detectType(StatTypeFile, 'foo.md');

    expect(actual).toBe(FileTypeMarkdown);
  });

  it('returns FileTypeMarkdown when extension is `txt`', () => {
    const actual = detectType(StatTypeFile, 'foo.txt');

    expect(actual).toBe(FileTypeText);
  });

  it('returns FileTypeRaw when provide unregistered extension', () => {
    const actual = detectType(StatTypeFile, 'foo.bar');

    expect(actual).toBe(FileTypeRaw);
  });
});
