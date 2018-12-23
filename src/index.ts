import 'core-js/fn/array/flat-map';
import { CkusroConfig, mergeConfig } from './config';
import { build, buildDependencyTable, CkusroFile, DependencyTable, load, LoaderContext } from './loader';

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

  const files = build(context, root);
  const dependencies = buildDependencyTable(files);

  return {
    context,
    files,
    dependencyTable: dependencies,
  };
}

const conf = mergeConfig({});
main(conf);
