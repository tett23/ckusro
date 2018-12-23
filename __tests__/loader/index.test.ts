import { load, StatTypeDirectory, StatTypeFile } from '../../src/loader';
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
