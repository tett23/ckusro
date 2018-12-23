import 'core-js/fn/array/flat-map';
import { mergeConfig } from './config';
import { build, buildDependencyTable, load } from './loader';

export default async function main() {
  const config = mergeConfig({});
  const objects = await load(config.targetDirectory, config.loader.extensions);
  if (objects == null) {
    return;
  }

  const files = build(objects);
  const dependencies = buildDependencyTable(files);

  console.info(dependencies);
}

main();
