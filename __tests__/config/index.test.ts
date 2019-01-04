import { resolve as resolvePath } from 'path';
import { mergeConfig } from '../../src/config';
import { CkusroConfig } from '../../src/models/ckusroConfig';
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
      loaderConfig: {
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
      loaderConfig: {
        extensions: /\.(md|txt)$/,
      },
    };

    expect(actual).toMatchObject(expected);
  });
});
