import writeFile, { determineAbsolutePath } from '../../src/staticRenderer/io';
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
    const actual = await writeFile(
      '/test',
      'namespace',
      '/foo.md',
      '# test file',
    );

    expect(actual).toBe(true);
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
