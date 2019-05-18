import { FileModeDirectory } from '../../src/models/StatType';
import { loadContent } from '../../src/models/UnloadedFile';
import { buildUnloadedFile } from '../__fixtures__';

describe(loadContent, () => {
  it('returns string when mode is file', async () => {
    const unloadedFile = buildUnloadedFile({
      absolutePath: '/test/foo.md',
    });
    const readFile = jest.fn().mockResolvedValue('test file');
    const actual = await loadContent(readFile, unloadedFile);
    const expected = 'test file';

    expect(actual).toBe(expected);
  });

  it('returns null when mode is directory', async () => {
    const unloadedFile = buildUnloadedFile({
      absolutePath: '/test/foo.md',
      mode: FileModeDirectory,
    });
    const readFile = jest.fn().mockResolvedValue('test file');
    const actual = await loadContent(readFile, unloadedFile);
    const expected = null;

    expect(actual).toBe(expected);
  });

  it('returns Error when threw Error', async () => {
    const unloadedFile = buildUnloadedFile({
      absolutePath: '/test/foo.md',
    });
    const readFile = jest.fn().mockRejectedValue(new Error());
    const actual = await loadContent(readFile, unloadedFile);

    expect(actual).toBeInstanceOf(Error);
  });
});
