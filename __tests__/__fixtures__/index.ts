import merge from 'lodash.merge';
import { defaultConfig } from '../../src/config';
import { CkusroConfig, isCkusroConfig } from '../../src/models/ckusroConfig';
import {
  CkusroFile,
  FileTypeMarkdown,
  newCkusroFile,
} from '../../src/models/ckusroFile';
import { buildDependencyTable, invert } from '../../src/models/dependencyTable';
import { GlobalState } from '../../src/models/globalState';
import { LoaderContext } from '../../src/models/loaderContext';
import { OutputContext } from '../../src/models/outputContext';

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
    invertedDependencyTable: {},
  };

  const ret = merge(globalState, overrides);
  ret.dependencyTable = buildDependencyTable(ret.files);
  ret.invertedDependencyTable = invert(ret.dependencyTable);

  return ret;
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
    loaderConfig: {
      extensions: /\.(md|txt)$/,
    },
  };

  const ret = merge(defaultConfig, config, overrides);
  if (!isCkusroConfig(ret)) {
    throw new Error('Malformed config.');
  }

  return ret;
}

export function buildFile(overrides: Partial<CkusroFile> = {}): CkusroFile {
  const template = newCkusroFile({
    namespace: 'test',
    name: 'foo.md',
    path: '/foo.md',
    fileType: FileTypeMarkdown,
    isLoaded: true,
    content: '[[bar.md]]',
    weakDependencies: ['test:/bar.md'],
    strongDependencies: ['test:/bar.md'],
    variables: [],
  });

  return { ...template, ...overrides };
}
