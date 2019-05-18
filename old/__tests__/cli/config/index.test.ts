import { normalize, resolve as resolvePath } from 'path';
import { mergeConfig } from '../../../src/cli/config';
import { CkusroConfig } from '../../../src/models/ckusroConfig';
import { LocalLoaderContextType } from '../../../src/models/loaderContext/LocalLoaderContext';
import { buildCkusroConfig, buildTargetDirectory } from '../../__fixtures__';
import {
  mockFileSystem,
  restoreFileSystem,
} from '../../__helpers__/mockFileSystem';

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
        buildTargetDirectory({
          type: LocalLoaderContextType,
          path: '/test',
          name: 'test',
          innerPath: './',
        }),
      ],
      outputDirectory: '/out',
    });
    const expected: CkusroConfig = buildCkusroConfig({
      targetDirectories: [
        buildTargetDirectory({
          type: LocalLoaderContextType,
          path: '/test',
          name: 'test',
          innerPath: './',
        }),
      ],
      outputDirectory: '/out',
    });

    expect(actual).toMatchObject(expected);
  });

  it('resolve paths', () => {
    const actual = mergeConfig({
      targetDirectories: [
        buildTargetDirectory({
          type: LocalLoaderContextType,
          path: '/test',
          name: 'test',
          innerPath: './',
        }),
      ],
      outputDirectory: 'out',
    });
    const expected: CkusroConfig = buildCkusroConfig({
      targetDirectories: [
        buildTargetDirectory({
          type: LocalLoaderContextType,
          path: resolvePath('/test'),
          name: 'test',
          innerPath: normalize('./'),
        }),
      ],
      outputDirectory: resolvePath('out'),
    });

    expect(actual).toMatchObject(expected);
  });
});
