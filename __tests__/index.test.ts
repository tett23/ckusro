import main from '../src/index';
import { CkusroConfig } from '../src/models/ckusroConfig/ckusroConfig';
import { buildCkusroConfig } from './__fixtures__';
import { mockFileSystem, restoreFileSystem } from './__helpers__/fs';

function jsonReplacer(_: string, value: any) {
  if (value instanceof RegExp) {
    return `/${value.source}/`;
  }

  return value;
}

describe(main, () => {
  function mock(config: CkusroConfig) {
    mockFileSystem({
      '/test/test_ns/foo/bar/baz.md': '# test file',
      '/conf.json': JSON.stringify(config, jsonReplacer),
    });
  }

  afterEach(() => {
    restoreFileSystem();
  });

  function isBooleanArray(obj: any): obj is boolean[] {
    if (!Array.isArray(obj)) {
      return false;
    }

    return obj.every((item) => typeof item === 'boolean');
  }

  it('returns GlobalState', async () => {
    const conf: CkusroConfig = buildCkusroConfig({
      targetDirectories: [
        {
          path: '/test',
          name: 'test_ns',
          innerPath: './',
        },
      ],
    });
    mock(conf);
    const actual = await main('node hoge -c /conf.json build'.split(' '));

    expect(isBooleanArray(actual)).toEqual(true);
  });

  it('returns Error when directory does not exist', async () => {
    const conf: CkusroConfig = buildCkusroConfig({
      targetDirectories: [
        {
          path: '/does_not_exist',
          name: 'does_not_exist',
          innerPath: './',
        },
      ],
    });
    mock(conf);
    const actual = await main('-c /conf.json build'.split(' '));

    expect(actual).toBeInstanceOf(Error);
  });
});
