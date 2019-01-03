import merge from 'lodash.merge';
import uuid from 'uuid/v4';
import { CkusroFile, FileTypeMarkdown, LoaderContext } from '../../src/loader';
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

export function buildGlobalState(
  overrides: Partial<GlobalState> = {},
): GlobalState {
  const globalState: GlobalState = {
    context: buildLoaderContext(),
    files: [],
    dependencyTable: {},
  };

  return merge(globalState, overrides);
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