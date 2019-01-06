import merge from 'lodash.merge';
import uuid from 'uuid/v4';
import { LoaderContext } from '../../src/loader';
import { CkusroConfig } from '../../src/models/ckusroConfig';
import { CkusroFile, FileTypeMarkdown } from '../../src/models/ckusroFile';
import { OutputContext } from '../../src/models/outputContext';
import { GlobalState } from '../../src/staticRenderer/buildGlobalState';

export function buildLoaderContext(
  overrides: Partial<LoaderContext> = {},
): LoaderContext {
  const loaderContext: LoaderContext = {
    path: '/test',
    name: 'test_namespace',
  };

  return merge(loaderContext, overrides);
}

export function buildOutputContext(
  overrides: Partial<OutputContext> = {},
): LoaderContext {
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
  };

  return merge(globalState, overrides);
}

export function buildCkusroConfig(
  overrides: DeepPartial<CkusroConfig> = {},
): CkusroConfig {
  const config: CkusroConfig = {
    outputDirectory: '/out',
    targetDirectories: [
      {
        path: '/test/test_ns',
        name: 'test_ns',
        innerPath: './',
      },
    ],
    loaderConfig: {
      extensions: /\.(md|txt)$/,
    },
    plugins: {
      parsers: [],
      components: [],
    },
  };

  return merge(config, overrides);
}

export function buildFile(overrides: Partial<CkusroFile> = {}): CkusroFile {
  const template = {
    id: uuid(),
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
