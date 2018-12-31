import writeFile, { WriteInfo } from '../../src/staticRenderer/io';
import { mockFileSystem, restoreFileSystem } from '../__helpers__/fs';

describe(writeFile, () => {
  beforeEach(() => {
    mockFileSystem({
      '/test/foo/bar/baz.md': '# test file',
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

  it('writes file', async () => {
    const writeInfo: WriteInfo = {
      path: '/test/out/baz.md',
      content: 'test content',
    };
    const actual = await writeFile(writeInfo);

    expect(actual).toBe(true);
  });
});
