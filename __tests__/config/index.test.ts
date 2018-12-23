import { resolve as resolvePath } from 'path';
import { CkusroConfig, mergeConfig } from '../../src/config';
import { mockFileSystem, restoreFileSystem } from '../__helpers__/fs';

describe(mergeConfig.name, () => {
  beforeEach(() => {
    mockFileSystem({});
  });
  afterEach(() => {
    restoreFileSystem();
  });

  it('override properties', () => {
    const actual = mergeConfig({
      targetDirectory: '/test',
      outputDirectory: '/out',
    });
    const expected: CkusroConfig = {
      targetDirectory: '/test',
      outputDirectory: '/out',
      loader: {
        extensions: /\.(md|txt)$/,
      },
    };

    expect(actual).toMatchObject(expected);
  });

  it('resolve paths', () => {
    const actual = mergeConfig({
      targetDirectory: 'test',
      outputDirectory: 'out',
    });
    const expected: CkusroConfig = {
      targetDirectory: resolvePath('test'),
      outputDirectory: resolvePath('out'),
      loader: {
        extensions: /\.(md|txt)$/,
      },
    };

    expect(actual).toMatchObject(expected);
  });
});
