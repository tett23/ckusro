import { FileTypeDirectory, FileTypeFile, load } from '../../src/loader';
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
      fileType: FileTypeDirectory,
      children: [
        {
          name: 'bar',
          fileType: FileTypeDirectory,
          children: [
            {
              name: 'baz.md',
              fileType: FileTypeFile,
              children: [],
            },
          ],
        },
      ],
    });
  });
});
