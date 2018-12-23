import 'core-js/fn/array/flat-map';
import { CkusroConfig, mergeConfig } from './config';
import {
  build,
  buildDependencyTable,
  CkusroFile,
  DependencyTable,
  load,
  loadContent,
  loadDependency,
  LoaderContext,
} from './loader';

export type GlobalState = {
  context: LoaderContext;
  files: CkusroFile[];
  dependencyTable: DependencyTable;
};

export default async function main(config: CkusroConfig): Promise<GlobalState | Error> {
  const result = await load(config.targetDirectory, config.loader.extensions);
  if (result instanceof Error) {
    return result;
  }
  const [context, root] = result;

  const ps = build(context, root).map(async (item) => await loadContent(context, item));
  const files = await Promise.all(ps);
  const dependencyLoaded = files.map((item) => loadDependency(context, item, files));
  const dependencies = buildDependencyTable(dependencyLoaded);

  return {
    context,
    files: dependencyLoaded,
    dependencyTable: dependencies,
  };
}

const conf = mergeConfig({});
main(conf);
