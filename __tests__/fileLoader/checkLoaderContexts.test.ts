import { isErrors } from '../../src/core/utils/types';
import checkLoaderContexts, {
  isValidLoaderContext,
} from '../../src/fileLoader/checkLoaderContexts';
import { buildLocalLoaderContext } from '../__fixtures__';
import { mockFileSystem, restoreFileSystem } from '../__helpers__/fs';

describe(checkLoaderContexts, () => {
  beforeEach(() => {
    mockFileSystem({
      '/dir': {},
      '/file': '# test file',
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

  it('returns true when context path is directory', async () => {
    const context = buildLocalLoaderContext({
      path: '/dir',
    });
    const actual = await checkLoaderContexts([context]);

    expect(isErrors(actual)).toBe(false);
  });

  it('returns false when context path is file', async () => {
    const context = buildLocalLoaderContext({
      path: '/file',
    });
    const actual = await checkLoaderContexts([context]);

    expect(isErrors(actual)).toBe(true);
  });
});

describe(isValidLoaderContext, () => {
  beforeEach(() => {
    mockFileSystem({
      '/dir': {},
      '/file': '# test file',
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

  it('returns true when context path is directory', async () => {
    const context = buildLocalLoaderContext({
      path: '/dir',
    });
    const actual = await isValidLoaderContext(context);

    expect(actual).toBe(true);
  });

  it('returns true when context path is file', async () => {
    const context = buildLocalLoaderContext({
      path: '/file',
    });
    const actual = await isValidLoaderContext(context);

    expect(actual).toBe(false);
  });
});
