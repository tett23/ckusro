import { dirname, join } from 'path';
import LoaderInfoBuilder from '../core/LoaderInfoBuilder';
import NodeFS from '../core/LoaderInfoBuilder/NodeFS';
import { FS } from '../core/types';
import { separateErrors } from '../core/utils/errors';
import { isErrors, isNonNullObject } from '../core/utils/types';
import { CkusroConfig } from './ckusroConfig';
import { FileBuffersState } from './FileBuffersState';
import { LoaderContext, newLoaderContexts } from './loaderContext';
import { LocalLoaderContextType } from './loaderContext/LocalLoaderContext';
import { isNamespace, Namespace } from './Namespace';
import { newOutputContext } from './OutputContext';
import { isPlugins, Plugins } from './plugins';

export type GlobalState = {
  readonly namespaces: Namespace[];
  readonly plugins: Plugins;
};

export function isGlobalState(value: unknown): value is GlobalState {
  if (!isNonNullObject(value)) {
    return false;
  }

  if (!Array.isArray((value as GlobalState).namespaces)) {
    return false;
  }

  if (!(value as GlobalState).namespaces.every(isNamespace)) {
    return false;
  }

  if (!isPlugins((value as GlobalState).plugins)) {
    return false;
  }

  return true;
}

export function newGlobalState(conf: CkusroConfig): GlobalState {
  const namespaces = newLoaderContexts(
    conf.targetDirectories,
    conf.loaderConfig,
  ).map(
    (loaderContext: LoaderContext): Namespace => {
      return {
        name: loaderContext.name,
        loaderContext,
        outputContext: newOutputContext(conf, loaderContext),
      };
    },
  );

  return {
    namespaces,
    plugins: conf.plugins,
  };
}

function getFs(context: LoaderContext): FS {
  switch (context.type) {
    case LocalLoaderContextType:
      return NodeFS;
    default:
      throw new Error();
  }
}

export async function reloadFiles(
  globalState: GlobalState,
): Promise<FileBuffersState | Error[]> {
  const { plugins } = globalState;
  const ps = globalState.namespaces.map((ns) =>
    // FIXME
    LoaderInfoBuilder(getFs(ns.loaderContext), ns, plugins),
  );
  const results: Array<FileBuffersState | Error> = (await Promise.all(
    ps,
  )).flat() as any[];
  const [fsbs, errors] = separateErrors(results);
  if (isErrors(errors)) {
    return errors;
  }

  return fsbs.reduce(
    (acc, fbs) => {
      acc.fileBuffers.push(...fbs.fileBuffers);
      acc.dependencyTable = { ...acc.dependencyTable, ...fbs.dependencyTable };
      acc.dependencyTable = {
        ...acc.invertedDependencyTable,
        ...fbs.invertedDependencyTable,
      };

      return acc;
    },
    {
      fileBuffers: [],
      dependencyTable: {},
      invertedDependencyTable: {},
    } as FileBuffersState,
  );
}

export function outputDirectory(globalState: GlobalState): string {
  return dirname(globalState.namespaces[0].outputContext.path);
}

export function assetsDirectory(globalState: GlobalState): string {
  return join(outputDirectory(globalState), 'assets');
}
