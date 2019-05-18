import jsyaml from 'js-yaml';
import fromCLIOptions, {
  loadConfigFile,
} from '../../../src/cli/config/fromCLIOptions';
import { PrimitiveCkusroConfig } from '../../../src/cli/config/toCkusroConfig';
import { CkusroConfig } from '../../../src/models/ckusroConfig';
import { defaultLoaderConfig } from '../../../src/models/ckusroConfig/LoaderConfig';
import { LocalLoaderContextType } from '../../../src/models/loaderContext/LocalLoaderContext';
import {
  buildCkusroConfig,
  buildCLIOptions,
  buildLoaderConfig,
  buildPlugins,
  buildTargetDirectory,
} from '../../__fixtures__';
import {
  mockFileSystem,
  restoreFileSystem,
} from '../../__helpers__/mockFileSystem';

function jsonReplacer(_: string, value: any) {
  if (value instanceof RegExp) {
    return `/${value.source}/`;
  }

  return value;
}

describe(fromCLIOptions, () => {
  const targetDirectories = [
    buildTargetDirectory({
      type: LocalLoaderContextType,
      path: '/test',
      name: 'test',
      innerPath: '.',
    }),
  ];
  const conf: CkusroConfig = buildCkusroConfig({
    outputDirectory: '/out',
    targetDirectories,
    loaderConfig: buildLoaderConfig(),
    plugins: buildPlugins(),
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
    const options = buildCLIOptions({
      config: '/config.json',
      outputDirectory: undefined,
      targetDirectories: undefined,
      enable: undefined,
    });
    const actual = fromCLIOptions(options);
    const expected: Partial<CkusroConfig> = conf;

    expect(actual).toEqual(expected);
  });

  it.skip('parses loaderConfig.enable', () => {
    const options = buildCLIOptions({ enable: '/.md/' });
    const actual = fromCLIOptions(options);
    const expected: Partial<CkusroConfig> = {
      loaderConfig: defaultLoaderConfig(),
    };

    expect(actual).toMatchObject(expected);
  });
});

describe(loadConfigFile, () => {
  const targetDirectories = [
    buildTargetDirectory({
      type: LocalLoaderContextType,
      path: '/test',
      name: 'test',
      innerPath: '.',
    }),
  ];
  const conf: DeepPartial<PrimitiveCkusroConfig> = {
    outputDirectory: '/out',
    targetDirectories,
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
