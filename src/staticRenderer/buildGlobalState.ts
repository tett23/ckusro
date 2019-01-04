import {
  build,
  buildDependencyTable,
  DependencyTable,
  load,
  loadContent,
  loadDependencies,
  LoaderContext,
} from '../loader';
import { CkusroConfig } from '../models/ckusroConfig';
import { CkusroFile } from '../models/ckusroFile';
import { newOutputContext, OutputContext } from '../models/outputContext';

export type GlobalState = {
  loaderContexts: LoaderContext[];
  outputContexts: OutputContext[];
  files: CkusroFile[];
  dependencyTable: DependencyTable;
};

export default async function buildGlobalState(
  config: CkusroConfig,
): Promise<GlobalState | Error> {
  const result = await load(config.targetDirectory, config.loader.extensions);
  if (result instanceof Error) {
    return result;
  }
  const [loaderContext, root] = result;

  const ps = build(loaderContext, root).map(
    async (item) => await loadContent(loaderContext, item),
  );
  const files = await Promise.all(ps);
  const dependencyLoaded = files.map((item) =>
    loadDependencies(loaderContext, item, files),
  );
  const dependencies = buildDependencyTable(dependencyLoaded);
  const loaderContexts = [loaderContext];
  const outputContexts = loaderContexts.map((context) =>
    newOutputContext(config, context),
  );

  return {
    loaderContexts,
    outputContexts,
    files: dependencyLoaded,
    dependencyTable: dependencies,
  };
}
