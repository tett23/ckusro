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
} from '../../src/models/CkusroFile';
import {
  DefaultPluginsConfig,
  defaultPluginsConfig,
} from '../../src/models/DefaultPluginConfig';
import { buildDependencyTable, invert } from '../../src/models/DependencyTable';
import {
  GitLoaderContext,
  GitLoaderContextType,
} from '../../src/models/loaderContext/GitLoaderContext';
import {
  LocalLoaderContext,
  LocalLoaderContextType,
} from '../../src/models/loaderContext/LocalLoaderContext';
import { Namespace } from '../../src/models/Namespace';
import { GlobalState } from '../../src/models/OldGlobalState';
import { OutputContext } from '../../src/models/OutputContext';
import { Plugins } from '../../src/models/plugins';
import defaultPlugins from '../../src/models/plugins/defaultPlugins';

export function buildLocalLoaderContext(
  overrides: Partial<LocalLoaderContext> = {},
): LocalLoaderContext {
  const loaderContext: LocalLoaderContext = {
    type: LocalLoaderContextType,
    path: '/test',
    name: 'test_namespace',
    loaderConfig: defaultLoaderConfig(),
  };

  return merge(loaderContext, overrides);
}

export function buildGitLoaderContext(
  overrides: Partial<GitLoaderContext> = {},
): GitLoaderContext {
  const loaderContext: GitLoaderContext = {
    type: GitLoaderContextType,
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
    loaderContexts: [buildLocalLoaderContext()],
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

export function buildNamespace(overrides: Partial<Namespace> = {}): Namespace {
  const namespace: Namespace = {
    name: 'test_namespace',
    loaderContext: buildLocalLoaderContext(),
    outputContext: buildOutputContext(),
  };

  return { ...namespace, ...overrides };
}
