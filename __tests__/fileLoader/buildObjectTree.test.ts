import { buildObjectTree } from '../../src/fileLoader/buildObjectTree';
import {
  CkusroObject,
  StatTypeDirectory,
  StatTypeFile,
} from '../../src/fileLoader/ckusroObject';
import { buildLoaderConfig } from '../__fixtures__';
import { mockFileSystem, restoreFileSystem } from '../__helpers__/fs';

describe(buildObjectTree, () => {
  beforeEach(() => {
    mockFileSystem({
      '/test/foo/bar/baz.md': '# test file',
      '/test/foo/bar/baz.js': '# test file',
    });
  });

  afterEach(() => {
    restoreFileSystem();
  });

  it('returns root CkusroObject', async () => {
    const actual = await buildObjectTree('/test', buildLoaderConfig(), '/test');
    const expected: CkusroObject = {
      name: 'test',
      path: '/',
      fileType: StatTypeDirectory,
      children: [
        {
          name: 'foo',
          path: '/foo',
          fileType: StatTypeDirectory,
          children: [
            {
              name: 'bar',
              path: '/foo/bar',
              fileType: StatTypeDirectory,
              children: [
                {
                  name: 'baz.md',
                  path: '/foo/bar/baz.md',
                  fileType: StatTypeFile,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };

    expect(actual).toEqual(expected);
  });
});
