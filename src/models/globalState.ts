import {
  build,
  loadContent,
  loadDependencies,
  loadRootObjects,
} from '../fileLoader';
import { CkusroConfig, LoaderConfig } from './ckusroConfig/ckusroConfig';
import { CkusroFile } from './ckusroFile';
import {
  buildDependencyTable,
  DependencyTable,
  invert,
} from './dependencyTable';
import { LoaderContext, newLoaderContexts } from './loaderContext';
import { newOutputContext, OutputContext } from './outputContext';
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
): Promise<GlobalState | Error> {
  const loaderContexts = newLoaderContexts(config.targetDirectories);
  const outputContexts = loaderContexts.map((context) =>
    newOutputContext(config, context),
  );

  const result = await loadFiles(
    loaderContexts,
    config.loaderConfig,
    config.plugins,
  );
  if (result instanceof Error) {
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
): Promise<[CkusroFile[], DependencyTable, DependencyTable] | Error> {
  const rootObjects = await loadRootObjects(loaderContexts, loaderConfig);
  if (rootObjects instanceof Error) {
    return rootObjects;
  }

  const ps = rootObjects.flatMap(async ([loaderContext, rootNode]) => {
    const pps = build(loaderContext, rootNode).map(
      async (item) => await loadContent(loaderContext, item),
    );
    const items = await Promise.all(pps);

    return items.map((item) =>
      loadDependencies(plugins, loaderContext, item, items),
    );
  });

  const files = (await Promise.all(ps)).flatMap((item) => item);

  const dependencyTable = buildDependencyTable(files);
  const invertedDependencyTable = invert(dependencyTable);

  return [files, dependencyTable, invertedDependencyTable];
}
