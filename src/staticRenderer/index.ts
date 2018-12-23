import { CkusroConfig } from '../config';
import {
  build,
  buildDependencyTable,
  CkusroFile,
  DependencyTable,
  load,
  loadContent,
  loadDependencies,
  LoaderContext,
} from '../loader';

export type GlobalState = {
  context: LoaderContext;
  files: CkusroFile[];
  dependencyTable: DependencyTable;
};

export default async function render(
  config: CkusroConfig,
): Promise<GlobalState | Error> {
  const result = await load(config.targetDirectory, config.loader.extensions);
  if (result instanceof Error) {
    return result;
  }
  const [context, root] = result;

  const ps = build(context, root).map(
    async (item) => await loadContent(context, item),
  );
  const files = await Promise.all(ps);
  const dependencyLoaded = files.map((item) =>
    loadDependencies(context, item, files),
  );
  const dependencies = buildDependencyTable(dependencyLoaded);

  return {
    context,
    files: dependencyLoaded,
    dependencyTable: dependencies,
  };
}
