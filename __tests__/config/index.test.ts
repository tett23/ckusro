import { normalize, resolve as resolvePath } from 'path';
import { mergeConfig } from '../../src/config';
import { CkusroConfig } from '../../src/models/ckusroConfig/ckusroConfig';
import { buildCkusroConfig } from '../__fixtures__';
import { mockFileSystem, restoreFileSystem } from '../__helpers__/fs';

describe(mergeConfig, () => {
  beforeEach(() => {
    mockFileSystem({});
  });
  afterEach(() => {
    restoreFileSystem();
  });

  it('override properties', () => {
    const actual = mergeConfig({
      targetDirectories: [
        {
          path: '/test',
          name: 'test',
          innerPath: './',
        },
      ],
      outputDirectory: '/out',
    });
    const expected: CkusroConfig = buildCkusroConfig({
      targetDirectories: [
        {
          path: '/test',
          name: 'test',
          innerPath: './',
        },
      ],
      outputDirectory: '/out',
    });

    expect(actual).toMatchObject(expected);
  });

  it('resolve paths', () => {
    const actual = mergeConfig({
      targetDirectories: [
        {
          path: '/test',
          name: 'test',
          innerPath: './',
        },
      ],
      outputDirectory: 'out',
    });
    const expected: CkusroConfig = buildCkusroConfig({
      targetDirectories: [
        {
          path: resolvePath('/test'),
          name: 'test',
          innerPath: normalize('./'),
        },
      ],
      outputDirectory: resolvePath('out'),
    });

    expect(actual).toMatchObject(expected);
  });
});
