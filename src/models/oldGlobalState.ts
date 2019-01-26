import { dirname, join } from 'path';
import { isErrors, isNonNullObject } from '../core/utils/types';
import fileLoader from '../fileLoader';
import { CkusroConfig } from './ckusroConfig';
import { LoaderConfig } from './ckusroConfig/LoaderConfig';
import { CkusroFile } from './CkusroFile';
import {
  buildDependencyTable,
  DependencyTable,
  invert,
} from './DependencyTable';
import { LoaderContext, newLoaderContexts } from './loaderContext';
import { newOutputContext, OutputContext } from './OutputContext';
import { Plugins } from './plugins';

export type GlobalState = {
  loaderContexts: LoaderContext[];
  outputContexts: OutputContext[];
  files: CkusroFile[];
  dependencyTable: DependencyTable;
  invertedDependencyTable: DependencyTable;
  loaderConfig: LoaderConfig;
  plugins: Plugins;
};

export default async function newGlobalState(
  config: CkusroConfig,
): Promise<GlobalState | Error[]> {
  const loaderContexts = newLoaderContexts(
    config.targetDirectories,
    config.loaderConfig,
  );
  const outputContexts = loaderContexts.map((context) =>
    newOutputContext(config, context),
  );

  const result = await loadFiles(
    loaderContexts,
    config.loaderConfig,
    config.plugins,
  );
  if (isErrors(result)) {
    return result;
  }

  const [files, dependencyTable, invertedDependencyTable] = result;

  return {
    loaderContexts,
    outputContexts,
    loaderConfig: config.loaderConfig,
    files,
    dependencyTable,
    invertedDependencyTable,
    plugins: config.plugins,
  };
}

export async function reloadFiles(
  globalState: GlobalState,
): Promise<GlobalState | Error> {
  const { loaderContexts, loaderConfig, plugins } = globalState;
  const result = await loadFiles(loaderContexts, loaderConfig, plugins);
  if (result instanceof Error) {
    return result;
  }

  const [files, dependencyTable, invertedDependencyTable] = result;

  return Object.assign({}, globalState, {
    files,
    dependencyTable,
    invertedDependencyTable,
  });
}

async function loadFiles(
  loaderContexts: LoaderContext[],
  loaderConfig: LoaderConfig,
  plugins: Plugins,
): Promise<[CkusroFile[], DependencyTable, DependencyTable] | Error[]> {
  const files = await fileLoader(loaderContexts, loaderConfig, plugins);
  if (isErrors(files)) {
    return files;
  }

  const dependencyTable = buildDependencyTable(files);
  const invertedDependencyTable = invert(dependencyTable);

  return [files, dependencyTable, invertedDependencyTable];
}

export function outputDirectory(globalState: GlobalState): string {
  return dirname(globalState.outputContexts[0].path);
}

export function assetsDirectory(globalState: GlobalState): string {
  return join(outputDirectory(globalState), 'assets');
}

export function isGlobalState(obj: unknown): obj is GlobalState {
  if (!isNonNullObject(obj)) {
    return false;
  }

  return (
    'loaderContexts' in obj &&
    'outputContexts' in obj &&
    'files' in obj &&
    'dependencyTable' in obj &&
    'invertedDependencyTable' in obj &&
    'loaderConfig' in obj &&
    'plugins' in obj
  );
}
