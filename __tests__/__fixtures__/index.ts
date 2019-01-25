import merge from 'lodash.merge';
import { CLIOptions } from '../../src/cli';
import { CLICommandBuild } from '../../src/cli/cliCommands';
import { defaultConfig } from '../../src/cli/config';
import { CkusroConfig, isCkusroConfig } from '../../src/models/ckusroConfig';
import {
  defaultLoaderConfig,
  LoaderConfig,
} from '../../src/models/ckusroConfig/LoaderConfig';
import {
  CkusroFile,
  FileTypeMarkdown,
  newCkusroId,
} from '../../src/models/ckusroFile';
import { buildDependencyTable, invert } from '../../src/models/dependencyTable';
import { GlobalState } from '../../src/models/globalState';
import { LoaderContext } from '../../src/models/loaderContext';
import { OutputContext } from '../../src/models/outputContext';
import {
  DefaultPluginsConfig,
  defaultPluginsConfig,
} from '../../src/models/pluginConfig';
import { Plugins } from '../../src/models/plugins';
import defaultPlugins from '../../src/models/plugins/defaultPlugins';

export function buildLoaderContext(
  overrides: Partial<LoaderContext> = {},
): LoaderContext {
  const loaderContext: LoaderContext = {
    path: '/test',
    name: 'test_namespace',
    loaderConfig: defaultLoaderConfig(),
  };

  return merge(loaderContext, overrides);
}

export function buildOutputContext(
  overrides: Partial<OutputContext> = {},
): OutputContext {
  const loaderContext: OutputContext = {
    path: '/out/test_namespace',
    name: 'test_namespace',
  };

  return merge(loaderContext, overrides);
}

export function buildGlobalState(
  overrides: Partial<GlobalState> = {},
): GlobalState {
  const globalState: GlobalState = {
    loaderContexts: [buildLoaderContext()],
    outputContexts: [buildOutputContext()],
    files: [],
    dependencyTable: {},
    invertedDependencyTable: {},
    loaderConfig: buildLoaderConfig(),
    plugins: defaultPlugins(defaultPluginsConfig()),
  };

  const ret = merge(globalState, overrides);
  ret.dependencyTable = buildDependencyTable(ret.files);
  ret.invertedDependencyTable = invert(ret.dependencyTable);

  return ret;
}

export function buildDefaultPluginsConfig(
  overrides: DeepPartial<DefaultPluginsConfig> = {},
): DefaultPluginsConfig {
  const data = defaultPluginsConfig();

  return merge(data, overrides);
}

export function buildCkusroConfig(
  overrides: DeepPartial<CkusroConfig> = {},
): CkusroConfig {
  const config: DeepPartial<CkusroConfig> = {
    outputDirectory: '/out',
    targetDirectories: [
      {
        path: '/test/test_ns',
        name: 'test_ns',
        innerPath: './',
      },
    ],
    loaderConfig: buildLoaderConfig(),
    plugins: defaultPlugins(buildDefaultPluginsConfig()),
  };

  const ret = merge(defaultConfig, config, overrides);
  if (!isCkusroConfig(ret)) {
    throw new Error('Malformed config.');
  }

  return ret;
}

export function buildPlugins(overrides: Partial<Plugins> = {}): Plugins {
  const plugins: Plugins = defaultPlugins(defaultPluginsConfig());

  return {
    parsers: overrides.parsers || plugins.parsers,
    components: overrides.components || plugins.components,
  };
}

export function buildLoaderConfig(
  overrides: Partial<LoaderConfig> = {},
): LoaderConfig {
  const loaderConfig = defaultLoaderConfig();

  return { ...loaderConfig, ...overrides };
}

export function buildFile(overrides: Partial<CkusroFile> = {}): CkusroFile {
  const template: CkusroFile = {
    id: newCkusroId(),
    namespace: 'test',
    name: 'foo.md',
    path: '/foo.md',
    fileType: FileTypeMarkdown,
    isLoaded: true,
    content: '[[bar.md]]',
    weakDependencies: ['test:/bar.md'],
    strongDependencies: ['test:/bar.md'],
    variables: [],
  };

  return { ...template, ...overrides };
}

export function buildCLIOptions(
  overrides: Partial<CLIOptions> = {},
): CLIOptions {
  const options = {
    command: CLICommandBuild,
    config: undefined,
    outputDirectory: '/out',
    targetDirectories: [],
    enable: '/.md/',
  };

  return { ...options, ...overrides };
}
