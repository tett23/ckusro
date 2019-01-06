import jsyaml from 'js-yaml';
import cli, { loadConfigFile } from '../../src/config/cli';
import { PrimitiveCkusroConfig } from '../../src/config/toCkusroConfig';
import { CkusroConfig } from '../../src/models/ckusroConfig';
import { buildCkusroConfig } from '../__fixtures__';
import { mockFileSystem, restoreFileSystem } from '../__helpers__/fs';

function jsonReplacer(_: string, value: any) {
  if (value instanceof RegExp) {
    return `/${value.source}/`;
  }

  return value;
}

describe(cli, () => {
  const conf: CkusroConfig = buildCkusroConfig({
    outputDirectory: '/out',
    targetDirectories: [
      {
        path: '/test',
        name: 'test',
        innerPath: '.',
      },
    ],
  });

  beforeEach(() => {
    const json = JSON.stringify(conf, jsonReplacer);
    mockFileSystem({
      '/config.json': json,
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

  it('parses config file', () => {
    const args = '-c /config.json'.split(' ');
    const actual = cli(args);
    const expected: Partial<CkusroConfig> = conf;

    expect(actual).toEqual(expected);
  });

  it('parses outputDirectory', () => {
    const args = '-o /test'.split(' ');
    const actual = cli(args);
    const expected: Partial<CkusroConfig> = { outputDirectory: '/test' };

    expect(actual).toMatchObject(expected);
  });

  it('parses loaderConfig.extensions', () => {
    const args = '--extensions /.md/'.split(' ');
    const actual = cli(args);
    const expected: Partial<CkusroConfig> = {
      loaderConfig: { extensions: /.md/ },
    };

    expect(actual).toMatchObject(expected);
  });
});

describe(loadConfigFile, () => {
  const conf: DeepPartial<PrimitiveCkusroConfig> = {
    outputDirectory: '/out',
    targetDirectories: [
      {
        path: '/test',
        name: 'test',
        innerPath: '.',
      },
    ],
    loaderConfig: {
      extensions: '/.md/',
    },
  };

  beforeEach(() => {
    const json = JSON.stringify(conf);
    const yaml = jsyaml.dump(conf);
    const js = `module.exports = ${json}`;

    mockFileSystem({
      '/configs/config.js': js,
      '/configs/config.json': json,
      '/configs/config.yml': yaml,
    });
  });
  afterEach(() => {
    restoreFileSystem();
  });

  it.skip('parses js file', () => {
    const actual = loadConfigFile('/configs/config.js');

    expect(actual).toEqual(conf);
  });

  it('parses json file', () => {
    const actual = loadConfigFile('/configs/config.json');

    expect(actual).toEqual(conf);
  });

  it('parses yaml file', () => {
    const actual = loadConfigFile('/configs/config.yml');

    expect(actual).toEqual(conf);
  });
});
