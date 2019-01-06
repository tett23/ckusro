import { build, load, loadContent, loadDependencies } from '../loader';
import { CkusroConfig } from '../models/ckusroConfig';
import { CkusroFile } from '../models/ckusroFile';
import {
  buildDependencyTable,
  DependencyTable,
  invert,
} from '../models/dependencyTable';
import { LoaderContext } from '../models/loaderContext';
import { newOutputContext, OutputContext } from '../models/outputContext';

export type GlobalState = {
  loaderContexts: LoaderContext[];
  outputContexts: OutputContext[];
  files: CkusroFile[];
  dependencyTable: DependencyTable;
  invertedDependencyTable: DependencyTable;
};

export default async function buildGlobalState(
  config: CkusroConfig,
): Promise<GlobalState | Error> {
  const results = await load(
    config.targetDirectories,
    config.loaderConfig.extensions,
  );
  if (results instanceof Error) {
    return results;
  }
  const ps = results.flatMap(async ([loaderContext, root]) => {
    const pps = build(loaderContext, root).map(
      async (item) => await loadContent(loaderContext, item),
    );
    const items = await Promise.all(pps);

    return items.map((item) => loadDependencies(loaderContext, item, items));
  });

  const files = (await Promise.all(ps)).flatMap((item) => item);
  const dependencyTable = buildDependencyTable(files);
  const invertedDependencyTable = invert(dependencyTable);
  const loaderContexts = results.map(([context]) => context);
  const outputContexts = loaderContexts.map((context) =>
    newOutputContext(config, context),
  );

  return {
    loaderContexts,
    outputContexts,
    files,
    dependencyTable,
    invertedDependencyTable,
  };
}
