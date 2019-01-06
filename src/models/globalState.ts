import {
  build,
  loadContent,
  loadDependencies,
  loadRootObjects,
} from '../fileLoader';
import { CkusroConfig } from './ckusroConfig';
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
  plugins: Plugins;
};

export default async function newGlobalState(
  config: CkusroConfig,
): Promise<GlobalState | Error> {
  const loaderContexts = newLoaderContexts(config.targetDirectories);
  const outputContexts = loaderContexts.map((context) =>
    newOutputContext(config, context),
  );

  const results = await loadRootObjects(
    config.targetDirectories,
    config.loaderConfig.extensions,
  );
  if (results instanceof Error) {
    return results;
  }

  const ps = results.flatMap(async ([loaderContext, rootNode]) => {
    const pps = build(loaderContext, rootNode).map(
      async (item) => await loadContent(loaderContext, item),
    );
    const items = await Promise.all(pps);

    return items.map((item) => loadDependencies(loaderContext, item, items));
  });

  const files = (await Promise.all(ps)).flatMap((item) => item);
  const dependencyTable = buildDependencyTable(files);
  const invertedDependencyTable = invert(dependencyTable);

  return {
    loaderContexts,
    outputContexts,
    files,
    dependencyTable,
    invertedDependencyTable,
    plugins: config.plugins,
  };
}
